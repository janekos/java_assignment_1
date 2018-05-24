package root;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class PlayerHandler {
	/* Player session tracking
	 * 		Player session starts when he logs in
	 * 		Player session ends when he is logged in and inactive for a configurable amount of time (1 minute by default)
	 * 		Session timeout error should be shown to player if he was inactive (not playing a game) for over a configurable amount of timeout time (1 minute by default)
*/
		
	public static String createPlayer(String name, String pw) {
        
		String sql = "INSERT INTO users(uname, pw) VALUES(?,?)";
		
        try {        	
        	Connection conn = DriverManager.getConnection(Config.getDbLoc());
        	
        	PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setString(2, pw);
            
            pstmt.executeUpdate();
        	
            //start session
            
            return "success";
        } catch(SQLException e) {
        	if(e.getLocalizedMessage().contains("SQLITE_CONSTRAINT_UNIQUE")) {
        		return "This username is taken.";
        	}
        	
        	return "Error adding player.";
        }
	}
	
	public static String authAndReturnPrevScoresPlayer(String name, String pw) {
        
		String users = "SELECT * FROM users WHERE uname = \"" + name + "\";";
		String games = "SELECT * FROM games WHERE uname = \"" + name + "\";";
		
        try {        	
        	Connection conn = DriverManager.getConnection(Config.getDbLoc());
        	
        	Statement stmt = conn.createStatement();
        	ResultSet usersRs = stmt.executeQuery(users);
        	
        	if(usersRs.next()) {
        		if(pw.equals(usersRs.getString("pw"))) {
            		
            		//start session
        			
        			String prevScores = "";
        			ResultSet gamesRs = stmt.executeQuery(games);
        			
            		while(gamesRs.next()) {
            			prevScores += gamesRs.getInt("pscore") + "," + gamesRs.getInt("npcscore")+";";
            		}
            		
            		gamesRs.close();
        			usersRs.close();
                	stmt.close();
                    conn.close();
            		
            		return prevScores;
            	}else {
            		usersRs.close();
                	stmt.close();
                    conn.close();
            		
            		return "bad pw";
            	}
        	}else {
        		return "no user";
        	}
        	
        } catch(SQLException e) { 
        	e.printStackTrace();
        	return "error";
        }
	}

	public static String startSession(String uname, String sessionId) {
		String sql = "INSERT INTO sessions(uname, sessionid, starttime, lastactive) VALUES(?,?, (datetime('now','localtime')), (datetime('now','localtime')));";
		
		try {
			Connection conn = DriverManager.getConnection(Config.getDbLoc());
			
        	PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, uname);
            pstmt.setString(2, sessionId);
            
            pstmt.executeUpdate();
            
            pstmt.close();
            conn.close();
            
        	return "success";
        	        	
		} catch (Exception e) {
			e.printStackTrace();
			return "error";
		}
	}
	
	public static String updateSession(String uname, String sessionId) {
		String sql = "UPDATE sessions SET lastactive = (datetime('now','localtime')) WHERE uname = ? AND sessionid = ? AND endtime = 0;";
				
		try {
			Connection conn = DriverManager.getConnection(Config.getDbLoc());			
        	PreparedStatement pstmt = conn.prepareStatement(sql);
        	
            pstmt.setString(1, uname);
            pstmt.setString(2, sessionId);
            
            pstmt.executeUpdate();
            
            pstmt.close();
            conn.close();
            
            return "success";
        	        	
		} catch (Exception e) {
			e.printStackTrace();
			return "error";
		}
	}	
	
	public static String checkSession(String uname, String sessionId) {
		String sql = "SELECT lastactive FROM sessions WHERE uname = \"" + uname + "\" AND sessionid = \"" + sessionId + "\" AND endtime = 0;";
		
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime ldt = LocalDateTime.parse(LocalDateTime.now().format(dtf), dtf);
		
		try {
			Connection conn = DriverManager.getConnection(Config.getDbLoc());
			
			Statement stmt = conn.createStatement();
        	ResultSet rs = stmt.executeQuery(sql);
        	        	
        	if(rs.next()) {
        		LocalDateTime sessStart = LocalDateTime.parse(rs.getString("lastactive"), dtf);
        		Duration d = Duration.between(sessStart, ldt);
        		
        		rs.close();
        		stmt.close();
    			conn.close();
    			
        		if(d.compareTo(Duration.ofMinutes(1)) == -1) {        			
        			return "success";        			
        		}else {
        			return "session ended";
        		}
        	}else {
        		rs.close();
        		stmt.close();
    			conn.close();
        		
        		return "no session";
        	}
        	
		} catch (Exception e) {
			e.printStackTrace();
			return "error";
		}
	}
	
	public static String endSession(String uname, String sessionId) {
		String sql = "UPDATE sessions SET endTime = (datetime('now','localtime')) WHERE uname = ? AND sessionid = ? AND endtime = 0;";

		try {
			Connection conn = DriverManager.getConnection(Config.getDbLoc());			
        	PreparedStatement pstmt = conn.prepareStatement(sql);
        	
            pstmt.setString(1, uname);
            pstmt.setString(2, sessionId);
            
            pstmt.executeUpdate();
            
            pstmt.close();
            conn.close();
            
        	return "success";
        	        	
		} catch (Exception e) {
			e.printStackTrace();
			return "error";
		}
	}
}
