import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, take } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  saveRecipes() {
    const recipes = this.recipeService.getRecipes();

    this.http.put(
      'https://recipe-angular-89836.firebaseio.com/recipes.json',
      recipes
    ).subscribe(
      (response) => {
        console.log(response)
      })
  }

  loadRecipes() {
    this.authService.user.pipe(take(1)).subscribe(user => {
      
    });
    return this.http.get<Recipe[]>(
      'https://recipe-angular-89836.firebaseio.com/recipes.json'
    )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
          })
        }),
        tap(recipes => {
          this.recipeService.loadRecipes(recipes);
        })
      )
  }
}
