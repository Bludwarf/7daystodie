import {Injectable} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';


/** Flat node with expandable and level information */
export class DynamicFlatNode<T> {
  constructor(public item: T, public level: number = 1, public hasChildren: boolean = false, public isLoading: boolean = false) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
export abstract class DynamicDatabase<T> {

  /** Initial data from database */
  initialData(): DynamicFlatNode<T>[] {
    return this.getRootLevelItems().map(item => new DynamicFlatNode<T>(item, 0, true));
  }

  abstract getRootLevelItems(): T[];

  abstract getChildren(item: T): Promise<T[] | undefined>;

  abstract hasChildren(item: T): Promise<boolean>;
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class DynamicDataSource<T> {

  dataChange: BehaviorSubject<DynamicFlatNode<T>[]> = new BehaviorSubject<DynamicFlatNode<T>[]>([]);

  /** children cache */
  children = new Map<T, T[]>();

  filterChange: BehaviorSubject<T> = new BehaviorSubject<T>(undefined);

  /** how items are filtered with by filter value */
  filterPredicate: (recipeItem: T, filter) => boolean;

  get data(): DynamicFlatNode<T>[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode<T>[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  private unfilteredData: DynamicFlatNode<T>[];

  /** current filter value */
  get filter(): T { return this.filterChange.value; }

  /** current filter value */
  set filter(value: T) {
    if (!this.unfilteredData) {
      this.unfilteredData = this.data;
    }
    this.data = this.unfilteredData.filter(node => !this.filter || this.filterPredicate && this.filterPredicate(node.item, value));
    this.filterChange.next(value);
  }

  constructor(private treeControl: DynamicFlatTreeControl<T>,
              private database: DynamicDatabase<T>) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode<T>[]> {
    this.treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode<T>>).added ||
        (change as SelectionChange<DynamicFlatNode<T>>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode<T>>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode<T>>) {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.reverse().forEach((node) => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  async toggleNode(node: DynamicFlatNode<T>, expand: boolean) {
    let children: T[];
    if (this.children.has(node.item)) {
      children = this.children.get(node.item);
    } else {
      node.isLoading = true;
      children = await this.database.getChildren(node.item);
    }
    const index = this.data.indexOf(node);
    if (!children || index < 0) { // If no children, or cannot find the node, no op
      node.isLoading = false;
      return;
    }

    if (expand) {
      const nodesPromises: Promise<DynamicFlatNode<T>>[] = children.map(async item =>
        new DynamicFlatNode<T>(item, node.level + 1, await this.database.hasChildren(item)));
      const nodes = await Promise.all(nodesPromises);
      this.data.splice(index + 1, 0, ...nodes);
      this.children.set(node.item, children);
    } else {
      const count = this.countInvisibleDescendants(node);
      this.data.splice(index + 1, count);
      this.children.delete(node.item);
    }

    // notify the change
    this.dataChange.next(this.data);
    node.isLoading = false;
  }

  countInvisibleDescendants(node: DynamicFlatNode<T>): number {
    let count = 0;
    if (!this.treeControl.isExpanded(node)) {
      this.treeControl.getDescendants(node).map(child => {
        count += 1 + this.countInvisibleDescendants(child);
      });
    }
    return count;
  }

}

export class DynamicFlatTreeControl<T> extends FlatTreeControl<DynamicFlatNode<T>> {
  constructor() {
    super(
      (node: DynamicFlatNode<T>) => node.level, // getLevel
      (node: DynamicFlatNode<T>) => node.hasChildren); // isExpandable
  }
}
