import { provideUserInput } from '../js/app';

global.fetch = jest.fn();
window.alert = jest.fn();

const mockedResponse = {
  latitude: '66.03478',
  longitude: '-100.07813',
  city: 'Nunavut',
  state: 'Nunavut',
  country: 'Canada',
};

describe('app tests', () => {
  describe('provideUserInput function', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('provideUserInput should successfully return mockedResponse', async () => {
      expect.assertions(2);
      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => Promise.resolve(mockedResponse),
        })
      );

      const result = await provideUserInput();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockedResponse);
    });

    it('provideUserInput should throw an alert and return null', async () => {
      expect.assertions(4);

      const messageAlert = {
        message: 'API unavailable',
      };

      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          status: 500,
          json: () => Promise.resolve(messageAlert),
        })
      );

      const result = await provideUserInput();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(null);
      expect(window.alert).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith(messageAlert.message);
    });
  });
});
