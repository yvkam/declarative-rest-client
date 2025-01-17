import { Observable, of } from 'rxjs';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { AbstractRestClient } from '../abstract-rest-client';
import { Get } from './request-methods';
import { Headers } from './headers';

describe('@Headers', () => {
  it('verify decorator attributes are set', () => {
    // Arrange
    let testHeaders;
    const requestMock = new HttpMock((req: HttpRequest<any>) => {
      testHeaders = req.headers;
      return of(new HttpResponse<any>({ status: 200 }));
    });
    const testClient = new TestClient(requestMock);

    // Act
    testClient.getItems().subscribe();
    // Assert
    expect(testHeaders.get('accept')).toBe('application/json');
    expect(testHeaders.get('lang')).toBe('en,nl');
  });
});

class HttpMock extends HttpClient {
  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor(
    private requestFunction: (
      req: HttpRequest<any>
    ) => Observable<HttpResponse<any>>
  ) {
    super(null);
  }

  request(
    req: HttpRequest<any> | any,
    p2?: any,
    p3?: any,
    p4?: any
  ): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }
}

class TestClient extends AbstractRestClient {
  constructor(httpHandler: HttpClient) {
    super(httpHandler);
  }

  @Get('/test')
  @Headers({
    accept: 'application/json',
    lang: ['en', 'nl'],
  })
  public getItems(): Observable<HttpResponse<any>> {
    return;
  }
}
