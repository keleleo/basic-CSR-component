/**
 * @description  INPUT: [] ---- OUTPUT: () ---- TWOWAY: [()]
 */
export enum BindType {
  NOBIND = 'UNBIND',

  /**
   * @description [] - root -> child
   */
  INPUT = 'INPUT',

  /**
   * @description () - child -> root
   */
  OUTPUT = 'OUTPUT',

  /**
   * @description [()] - root <-> child
   */
  TWOWAY = 'TWOWAY',

  /**
   * @description *for
   */
  FOR = 'FOR',
}
