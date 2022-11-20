/**
 * @author Honza "Abeee" Nemecek <honza@jnemecek.cz>
 * @description Abstract class for ApiManagers - provides apiToken
 */
export default abstract class ApiManager {
  /**
   * Api token that is essential for all api calls to api
   */
  apiToken: string = ''

  constructor(apiToken: string | undefined) {
    if (apiToken === undefined) {
      console.log('UNDEFINED APITOKEN!')
      return
    }

    this.apiToken = apiToken
  }

  getApiToken() {
    return this.apiToken
  }
}
