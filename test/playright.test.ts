import { Playright } from '../lib';

describe('Playright', () => {

    const pr = new Playright();

    it('should have description', async () => {
        expect(pr.toString()).toBeTruthy();
    });
});
