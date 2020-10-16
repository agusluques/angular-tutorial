import { Injectable } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {
  private ingredients: Ingredient[] = [];
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  
  constructor() { }

  getIngredient(index: number){
    return {... this.ingredients[index]};
  }

  getIngredients(){
    return [...this.ingredients];
  }

  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.getIngredients());
  }

  selectingredients(ingredients: Ingredient[]){
    this.ingredients = [...this.ingredients, ...ingredients]
    this.ingredientsChanged.next(this.getIngredients());
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = {...newIngredient};
    this.ingredientsChanged.next(this.getIngredients())
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.getIngredients());
  }

}
