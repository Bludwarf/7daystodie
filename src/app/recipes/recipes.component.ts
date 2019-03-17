import {Component, OnInit} from '@angular/core';
import {DynamicDataSource, DynamicFlatNode, DynamicFlatTreeControl} from '../common/dynamic-flat-tree';
import {RecipeItem, RecipesDatabase} from './recipes.database';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  providers: [RecipesDatabase]
})
export class RecipesComponent implements OnInit {
  treeControl: DynamicFlatTreeControl<RecipeItem>;
  dataSource: DynamicDataSource<RecipeItem>;

  constructor(database: RecipesDatabase) {
    this.treeControl = new DynamicFlatTreeControl<RecipeItem>();
    this.dataSource = new DynamicDataSource(this.treeControl, database);
    this.dataSource.data = database.initialData();
  }

  hasChildren = (_: number, nodeData: DynamicFlatNode<RecipeItem>) => nodeData.hasChildren;

  ngOnInit(): void {
  }
}

// /**
//  * File database, it can build a tree structured Json object from string.
//  * Each node in Json object represents a file or a directory. For a file, it has filename and type.
//  * For a directory, it has filename and children (a list of files or directories).
//  * The input will be a json object string, and the output is a list of `FileNode` with nested
//  * structure.
//  *
//  * @author https://stackblitz.com/edit/material-tree-dynamic
//  * @author bludwarf@gmail.com
//  */
// export abstract class DynamicDataSource<T> {
//
//   dataChange: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
//
//   get data(): T[] { return this.dataChange.value; }
//   set data(value: T[]) {
//     this.treeControl.dataNodes = value;
//     this.dataChange.next(value);
//   }
//
//   constructor(private treeControl: FlatTreeControl<T>,
//               private database: DynamicDatabase) {}
//
//   connect(collectionViewer: CollectionViewer): Observable<T[]> {
//     this.treeControl.expansionModel.onChange.subscribe(change => {
//       if ((change as SelectionChange<T>).added ||
//         (change as SelectionChange<T>).removed) {
//         this.handleTreeControl(change as SelectionChange<T>);
//       }
//     });
//
//     return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
//   }
//
//   /** Handle expand/collapse behaviors */
//   handleTreeControl(change: SelectionChange<T>) {
//     if (change.added) {
//       change.added.forEach((node) => this.toggleNode(node, true));
//     }
//     if (change.removed) {
//       change.removed.reverse().forEach((node) => this.toggleNode(node, false));
//     }
//   }
//
//   /**
//    * Toggle the node, remove from display list
//    */
//   toggleNode(node: T, expand: boolean) {
//     const children = this.database.getChildren(node.item);
//     const index = this.data.indexOf(node);
//     if (!children || index < 0) { // If no children, or cannot find the node, no op
//       return;
//     }
//
//
//     if (expand) {
//       node.isLoading = true;
//
//       setTimeout(() => {
//         const nodes = children.map(name =>
//           new DynamicFlatNode(name, node.level + 1, this.database.isExpandable(name)));
//         this.data.splice(index + 1, 0, ...nodes);
//         // notify the change
//         this.dataChange.next(this.data);
//         node.isLoading = false;
//       }, 1000);
//     } else {
//       this.data.splice(index + 1, children.length);
//       this.dataChange.next(this.data);
//     }
//   }
//
//   abstract newNode(): T;
// }
//
// @Injectable()
// export class RecipeItemDataSource extends DynamicDataSource<RecipeItem> {
//
// }
