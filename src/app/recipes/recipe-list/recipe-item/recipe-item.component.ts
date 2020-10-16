import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css'],
  animations: [
    trigger('listItem', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(1000)
      ])
    ])
  ]
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() id: number;

  ngOnInit(): void { 
  }

}
