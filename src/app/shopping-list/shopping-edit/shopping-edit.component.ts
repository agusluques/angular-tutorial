import { Component, OnInit, ViewChild, OnDestroy, } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('form', { static: false }) form: NgForm;
  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        })
      }
    )
  }

  onSubmit() {
    const ig = new Ingredient(this.form.value.name, this.form.value.amount);
    if (!this.editMode){
      this.shoppingListService.addIngredient(ig);
    } else {
      this.shoppingListService.updateIngredient(this.editedItemIndex, ig);
    }
    this.editMode = false;
    this.form.reset();
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.editMode = false;
    this.form.reset();
  }

  onClear(){
    this.form.reset();
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
