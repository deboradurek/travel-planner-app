import { getGeoNames } from '../api';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => jest.fn());

describe('server tests', () => {
  describe('getGeoNames function', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    // API response that contains only the parsed data
    const mockedResponse = {
      geonames: [
        {
          lat: '66.03478',
          lng: '-100.07813',
          name: 'Nunavut',
          adminName1: 'Nunavut',
          countryName: 'Canada',
        },
      ],
      totalResultsCount: 1,
    };

    // Actual test begins
    it('getGeoNames should successfully return mockedResponse', async () => {
      expect.assertions(2);

      // ProjectData mock expected results
      const expectedResult = {
        latitude: '66.03478',
        longitude: '-100.07813',
        city: 'Nunavut',
        state: 'Nunavut',
        country: 'Canada',
        travelDate: '2021-03-17',
        countdown: 0,
      };

      // Callback mock for fetch function with payload from API
      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(mockedResponse),
        })
      );

      // Function call that is being tested
      await getGeoNames({
        city: 'Nunavut',
        countryCode: 'CA',
        travelDate: '2021-03-17',
        countdown: 0,
      });

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(global.projectData).toEqual(expectedResult);
    });

    // Actual test begins
    it('getGeoNames should successfully return mockedResponse', async () => {
      expect.assertions(1);

      // Callback mock for fetch function with payload from API
      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ totalResultsCount: 0 }),
        })
      );

      // Function call
      try {
        // If successful
        await getGeoNames({
          city: 'Nunavut',
          countryCode: 'CA',
          travelDate: '2021-03-17',
          countdown: 0,
        });
      } catch (error) {
        // If not successful
        expect(error.message).toEqual('City not found.');
      }
    });
  });
});
