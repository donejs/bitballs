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

	fixture({method: "DELETE", url: 'services/teams/{id}'}, function() {
		return [];
	});
};

defineFixtures();

export default defineFixtures;