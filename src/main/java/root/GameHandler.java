package root;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.Random;

public class GameHandler {
	/* Handle requests from front end for game result calculation
	 * Calculate dice roll and return response to front end
	 * Validation: Player must exist
	 * Validation: Player must be logged in (player session should be started and active)
	 * */
	public static String rollDice(String uname, String sessionId) {
		
		PlayerHandler.updateSession(uname, sessionId);
		
		Random rand = new Random();
		String sql = "INSERT INTO games(uname, pscore, npcscore) VALUES(?,?,?)";
		int[] rolls = new int[]{rand.nextInt(6)+1, rand.nextInt(6)+1, rand.nextInt(6)+1, rand.nextInt(6)+1};
		
        try {        	
        	Connection conn = DriverManager.getConnection(Config.getDbLoc());
        	
        	PreparedStatement pstmt = conn.prepareStatement(sql);
        	pstmt.setString(1, "foo");
            pstmt.setInt(2, rolls[0] + rolls[1]);
            pstmt.setInt(3, rolls[2] + rolls[3]);
            
            pstmt.executeUpdate();
        	
            pstmt.close();
            conn.close();            
            
            return Arrays.toString(rolls);
        } catch(SQLException e) {
        	e.printStackTrace();
        	return "err";
        }
	}
}
