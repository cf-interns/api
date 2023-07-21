export interface CallbackServiceInterface {
  /**
   * Returns user or null
   * @param {any} body
   * @returns {Promise<any>}
   */
  createCallback(body: any): Promise<any>;

  /**
   * Create new password for user after reset password process
   *
   * @param {any} body
   * @returns {Promise<any>}
   */
  updateCallback(body: any): Promise<any>;
}
