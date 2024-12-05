import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { ColDef, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css']
})
export class GithubComponent {

  isConnected = false;
  name = '';
  email = '';
  synced = '';
  domLayout: any = 'autoHeight';

  columnDefs = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    {
      headerName: 'Link', field: 'html_url',

      cellRenderer: (params: any) => {
        return `<a href="${params.value}" target="_blank">Link</a>`;
      }
    },
    { headerName: 'Slug', field: 'full_name' },
    { headerName: 'Included', field: 'included', checkboxSelection: true },
  ];

  rowData: any = [];

  constructor(
    private httpService: HttpService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit() {
    // Get the code and state from the URL
    const code = this.route.snapshot.queryParamMap.get('code');
    let token = localStorage.getItem('access_token');

    if (code && !token) {
      this.httpService.getData(`github/callback?code=${code}`).subscribe(
        (data) => {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.name = data.user.name;
          this.synced = data.user.createdAt;
          this.isConnected = true;
          this.getRepos();
        },
        (error) => {
          console.error('Authentication failed', error);
        });
    } else {
      let token = localStorage.getItem('access_token');

      if (token) {
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);

        this.name = user.name;
        this.synced = user.createdAt;
        this.isConnected = true;
        this.getRepos()

      }

    }
  }


  connect() {
    window.location.href = 'http://localhost:3000/api/github/connect';
  }

  remove() {
    let token = localStorage.getItem('access_token');

    if (token) {
      this.httpService.getData(`github/remove`).subscribe(
        (data) => {
          const accessToken = data.access_token;
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          this.isConnected = false;
          console.log('Removed');
        },
        (error) => {
          console.error('Error removnig', error);
        });
    }
  }

  getRepos = () => {
    let token = localStorage.getItem('access_token');

    if (token) {
      this.httpService.getData(`github/getrepos`).subscribe(
        (data) => {
          data = data.data;
          console.log('data**', data);
          this.rowData = data;
        },
        (error) => {
          console.error('Error removnig', error);
        });
    }
  }


  masterGridOptions: any = {
    masterDetail: true,
    suppressRowClickSelection: true,
    detailCellRendererParams: {
      detailGridOptions: {
        columnDefs: [
          { headerName: 'UserID', field: 'userId' },
          { headerName: 'User', field: 'userName' },
          { headerName: 'Total Commits', field: 'totalCommits' },
          { headerName: 'Total Pull Requests', field: 'totalPulls' },
          { headerName: 'Total Issues', field: 'totalIssues' },

        ],
        domLayout: 'normal',
        rowData: []
      },
      getDetailRowData: (params: any) => {

        let id = params.data.id;
        let owner = params.data.owner.login;
        let name = params.data.name;

        this.httpService.getData(`github/getUserLevelDetail?owner=${owner}&name=${name}`).subscribe(
          (data) => {

            //get index from id
            let index = this.rowData.findIndex((x: any) => x.id == id);
            console.log('index', index);
            if (index > -1) {
              console.log('this.rowData[index]', this.rowData[index]);

              this.rowData[index].isChildExpanded = true;

              params.successCallback(data.finalData);  // Pass the data to the child grid

            }
          },
          (error) => {
            console.error('Error removnig', error);
          });

      },
      onFirstDataRendered: (event: any) => {
        this.updateCheckboxState(); // Ensure checkboxes are synced after the data is rendered
      }
    }
  };

  updateCheckboxState() {
    this.masterGridOptions.api.forEachNode((node: any) => {
      if (node.data && node.data.isChildExpanded) {
        node.setSelected(true); // Set checkbox to checked if child grid is expanded
      }
    });
  }

  onGridReady(event: any) {
    event.api.sizeColumnsToFit();
  }

  onRowClicked(event: any) {
    if (event.node.expanded) {
      event.node.setExpanded(false); // Collapse the row
    } else {
      event.node.setExpanded(true); // Expand the row
    }

    const rowNode = event.node;
    const rowData = rowNode.data;

    if (rowData) {
      rowData.isChildExpanded = rowNode.expanded; // Update the expansion state in the row data
      if (rowData.isChildExpanded) {
        rowNode.setSelected(true); // Check the checkbox when child grid is expanded
      } else {
        rowNode.setSelected(false); // Uncheck when child grid is collapsed
      }
    }

  }

}
