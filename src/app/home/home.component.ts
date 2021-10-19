import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginDisplay = false;

  constructor(private authService: MsalService,
     private msalBroadcastService: MsalBroadcastService,
     private http: HttpClient)
     {

     }

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
        const payload = result.payload as AuthenticationResult;
        this.authService.instance.setActiveAccount(payload.account);
      });

      this.setLoginDisplay();
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    let baseUrl = 'https://sales-api-azurewebsites.net/api/v1/';
    let apiPath = 'sales/' + this.region + '/' + this.country;
    let queryStrings = '?' + 'page=' + this.pageIndex + '&limit=' + this.limit + '&item-type=' + this.itemType;
    this.rowData = this.http.get<any[]>(baseUrl + apiPath + queryStrings);
  }

  region: string = '';
  country: string = '';
  itemType: string = '';
  pageIndex: number = 0;
  limit: number = 50;
  rowData!: Observable<any[]>;

  columnDefs: ColDef[] = [
      { field: 'orderId' },
      { field: 'orderDate' },
      { field: 'itemType' },
      { field: 'unitsSold' },
      { field: 'unitPrice' },
  ];

}
