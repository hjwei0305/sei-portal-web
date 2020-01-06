const { NODE_ENV } = process.env;

export const HOST = 'http://rddgit.changhong.com:7300/mock/5dfc741736608e42d52b1d7b';

export const CONTEXTPATH = NODE_ENV === 'development' ? '/api-mock' : '';//'/api-gateway';

export const BASEURL = `${HOST}${CONTEXTPATH}`;

export const PORTALSERVICE = `${BASEURL}/portal-service`;
