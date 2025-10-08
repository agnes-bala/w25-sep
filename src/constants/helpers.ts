const url = {
  // BASE_URL: 'http://10.20.10.14:8080/Revival',
  // BASE_URL: 'http://camp-service.jesusredeems.org/Revival',
  BASE_URL: 'http://10.20.1.36:8091/womenscamp',
//  BASE_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  BASE_URL1: 'https://partnerservice-stage.jesusredeems.com/jrms/v1',
};
const allowedRoles = [1, 4, 8, 9, 10, 11, 14, 15];

export const config = {
  BASE_URL: url.BASE_URL,
  BASE_URL1: url.BASE_URL1,
  allowedRoles,
};
