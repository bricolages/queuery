const UNAUTHORIZED = Symbol('unauthorized');

export {
  UNAUTHORIZED,
};

type Params<N extends string> = {[_ in N]: string | number};

class PathTemplate<N extends string> {
  constructor(public fragments: string[], public paramNames: N[]) {}

  render(params: Params<N>) {
    const buf = [this.fragments[0]];
    for (let i = 0; i < this.paramNames.length; ++i) {
      buf.push(params[this.paramNames[i]].toString());
      buf.push(this.fragments[i + 1]);
    }
    return buf.join('');
  }
}

function extractBody(res: Response) {
  if (res.status === 401) {
    return Promise.resolve(UNAUTHORIZED);
  } else if ( !res.ok ) {
    throw new Error(`Fetch: [${res.status}]${res.statusText}`);
  } else if ( res.status === 204) {
    return ;
  } else {
    return res.json();
  }
}

class GetEndpoint<N extends string, S> {
  constructor(protected template: PathTemplate<N>) {}

  async get(params: Params<N>): Promise<S> {
    const url = this.template.render(params);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    });
    return extractBody(res);
  }
}

class PostEndpoint<N extends string, Q, S> {
  constructor(protected template: PathTemplate<N>) { }

  post(params: Params<N>, reqBodyObj: Q): Promise<S> {
    const url = this.template.render(params);
    const body = JSON.stringify(reqBodyObj);
    return fetch(url, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(extractBody);
  }
}

class PutEndpoint<N extends string, Q> {
  constructor(protected template: PathTemplate<N>) { }

  put(params: Params<N>, reqBodyObj: Q): Promise<void> {
    const url = this.template.render(params);
    const body = JSON.stringify(reqBodyObj);
    return fetch(url, {
      body,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(extractBody)
    .then(() => { return; });
  }
}

class DeleteEndpoint<N extends string> {
  constructor(protected template: PathTemplate<N>) { }

  delete(params: Params<N>): Promise<void> {
    const url = this.template.render(params);
    const req = fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).then(() => { return; });
    return req;
  }
}

class Endpoint<N extends string> {
  constructor(private pathTemplate: PathTemplate<N>,) { }

  get<S>(): GetEndpoint<N, S> {
    return new GetEndpoint<N, S>(this.pathTemplate);
  }

  post<R, S>(): PostEndpoint<N, R, S> {
    return new PostEndpoint<N, R, S>(this.pathTemplate);
  }

  put<R>(): PutEndpoint<N, R> {
    return new PutEndpoint<N, R>(this.pathTemplate);
  }

  delete(): DeleteEndpoint<N> {
    return new DeleteEndpoint<N>(this.pathTemplate);
  }

}

function endpoint<N extends string>(strs: TemplateStringsArray, ...ns: N[]): Endpoint<N> {
  return new Endpoint(new PathTemplate<N>([...strs], ns));
}

export interface Query {
  id: string;
  error: string | null;
  status: string;
  created_at: string;
  s3_prefix?: string;
  select_stmt?: string;
  manifest_file_url?: string;
  job_id?: string;
  client_account_name?: string;
}

export interface ClientAccount {
  name: string;
  redshift_user: string;
  redshift_password?: string;
}

export interface ClientCredential {
  token: string;
  disabled: boolean;
}

export interface ClientCredentialWithSecret extends ClientCredential {
  token_secret: string;
}

export interface ClientCredentialAvailability {
  disabled: boolean;
}

const clientAccountsIndex = endpoint`/v2/client_accounts/`.get<ClientAccount[]>();
const clientAccountShow = endpoint`/v2/client_accounts/${'name'}`.get<ClientAccount>();
const clientAccountCreate = endpoint`/v2/client_accounts/`.post<ClientAccount, ClientAccount>();
const clientAccountUpdate = endpoint`/v2/client_accounts/${'name'}`.put<Required<ClientAccount>>();
const clientAccountDelete = endpoint`/v2/client_accounts/${'name'}`.delete();
const clientCredentialsIndex = endpoint`/v2/client_accounts/${'name'}/client_credentials`.get<ClientCredential[]>();
const clientCredentialCreate = endpoint`/v2/client_accounts/${'name'}/client_credentials`.post<ClientAccount, ClientCredentialWithSecret>();
const clientCredentialUpdate = endpoint`/v2/client_credentials/${'token'}`.put<ClientCredentialAvailability>();
const queriesIndex = endpoint`/v2/client_accounts/${'name'}/queries?fields=id,status,created_at,client_account_name`.get<Query[]>();
const queryShow    = endpoint`/v2/queries/${'id'}?fields=id,status,created_at,error,select_stmt,s3_prefix,manifest_file_url,job_id,client_account_name`.get<Query>();
const globalQueriesIndex = endpoint`/v2/queries?fields=id,status,created_at,client_account_name`.get<Query[]>();

export {
  clientAccountsIndex,
  clientAccountShow,
  clientAccountCreate,
  clientAccountUpdate,
  clientAccountDelete,
  clientCredentialsIndex,
  clientCredentialCreate,
  clientCredentialUpdate,
  queriesIndex,
  queryShow,
  globalQueriesIndex,
};
