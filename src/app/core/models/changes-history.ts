/**
 * Changes history.
 */
export class ChangesHistory<T> {
  private currentStateIndex = 0;
  private history: T[] = [];

  /**
   * .ctor
   * @param initState Initialize state of history.
   */
  public constructor(initState?: T) {
      if (initState !== undefined) {
        this.push(initState);
      }
  }

  /**
   * Push new state to history.
   * @param item New state.
   */
  public push(item: T): void {
      this.history.splice(this.currentStateIndex + 1);
      this.history.push(item);
      this.currentStateIndex = this.history.length - 1;
  }

  /**
   * Can undo.
   */
  public get canUndo(): boolean {
      return this.currentStateIndex > 0;
  }

  /**
   * Get "undo" state,
   */
  public undo(): T {
      this.currentStateIndex--;
      const item = this.history[this.currentStateIndex];
      return item;
  }

  /**
   * Can redo.
   */
  public get canRedo(): boolean {
      return this.currentStateIndex < this.history.length - 1;
  }

  /**
   * Get "redo" state.
   */
  public redo(): T {
      this.currentStateIndex++;
      const item = this.history[this.currentStateIndex];
      return item;
  }
}
