import { utils } from 'seid';

const { NODE_ENV } = process.env;

const { CONST_GLOBAL } = utils.constants;

export { CONST_GLOBAL };

export const HOST = '';

export const CONTEXTPATH = NODE_ENV === 'development' ? '/sei-gateway' : '/sei-gateway'; // '/api-gateway';

export const BASEURL = `${HOST}${CONTEXTPATH}`;

export const PORTALSERVICE = `/portal-service`;

export const SEIAUTHSERVICE = `${BASEURL}/sei-auth`;
