package root;

import java.util.Arrays;
import java.util.Random;

public class GameHandler {
	/* Handle requests from front end for game result calculation
	 * Calculate dice roll and return response to front end
	 * Validation: Player must exist
	 * Validation: Player must be logged in (player session should be started and active)
	 * */
	public static String rollDice() {
		//todo check for player existing and logged in
		Random rand = new Random();
		return Arrays.toString(new int[]{rand.nextInt(6)+1, rand.nextInt(6)+1, rand.nextInt(6)+1, rand.nextInt(6)+1});
	}
}
