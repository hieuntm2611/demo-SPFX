import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions, HttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http'
import { AadHttpClient } from '@microsoft/sp-http'


export default class RESTOperation {
    public static getQuiz(context: any, questionList: string): Promise<any> {
        var query = "/_api/web/lists/getbytitle('"+questionList+"')/Items";
        return context.spHttpClient.get(context.pageContext.web.absoluteUrl + query, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            });
    }
}