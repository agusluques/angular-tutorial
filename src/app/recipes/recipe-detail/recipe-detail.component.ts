import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  
  constructor(
    private shoppingListService: ShoppingListService, 
    private recipeService: RecipeService , 
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => {
        this.id = +param['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    )
  }

  toShoppingList(){
    this.shoppingListService.selectingredients(this.recipe.ingredients);
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes'])
  }
}
