import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'Hot Dog',
    //   'Best panchito ever',
    //   'https://cdn.pixabay.com/photo/2012/04/14/12/51/hot-33810_1280.png',
    //   [
    //     new Ingredient('Bread', 1),
    //     new Ingredient('Sausage', 1),
    //   ]),
    // new Recipe(
    //   'Burger',
    //   'This is THE burga',
    //   'https://cdn.pixabay.com/photo/2018/02/26/21/44/hamburger-3184108_1280.png',
    //   [
    //     new Ingredient('Bread', 2),
    //     new Ingredient('Meat', 1),
    //     new Ingredient('Cheese', 2),
    //     new Ingredient('Tomatoe', 1),
    //     new Ingredient('Salad', 1),
    //   ]),
  ];

  constructor() { }

  getRecipes() {
    return [...this.recipes];
  }

  getRecipe(index: number){
    return {...this.recipes[index]}
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next([...this.recipes]);
  }

  updateRecipe(index: number, recipe: Recipe){
    this.recipes[index] = recipe;
    this.recipesChanged.next([...this.recipes]);
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next([...this.recipes]);
  }

  loadRecipes(recipes: Recipe[]){
    this.recipes = [...recipes];
    this.recipesChanged.next([...this.recipes]);
  }
}
