import fixture from 'can-fixture';

export const teams = {
	data: [{
		id: 1,
		name: 'Three Dog Night',
		color: 'Red',
		player1Id: 1
	}]
};

export const defineFixtures = function () {
	fixture('services/teams', function () {
		return teams;
	});
};

defineFixtures();

export default defineFixtures;