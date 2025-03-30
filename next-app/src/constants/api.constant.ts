export const Api = {
  VIET_QR_IMAGE: {
    baseUrl: 'https://img.vietqr.io',
    paths: {
      image: '/image',
    },
  },
  VIET_QR: {
    baseUrl: 'https://api.vietqr.io/v2',
    paths: {
      banks: '/banks',
    },
  },
  placesApi: {
    autocomplete:
      'https://maps.googleapis.com/maps/api/place/autocomplete/json',
    detail: 'https://maps.googleapis.com/maps/api/place/details/json',
    geocode: 'https://maps.googleapis.com/maps/api/geocode/json',
  },
};
