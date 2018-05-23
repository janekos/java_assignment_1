package root;

import java.io.File;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseMethods {
	
	
	public static void createNewDb() {
		
		File f = new File(Config.getDbDir());
		if(!f.exists()) { f.mkdirs(); }
		
		String users = "CREATE TABLE users (\n"
                + "	id integer PRIMARY KEY AUTOINCREMENT,\n"
                + "	uname text NOT NULL UNIQUE,\n"
                + "	pw text NOT NULL\n"
                + ");";
		
		String games = "CREATE TABLE games (\n"
                + "	id integer PRIMARY KEY AUTOINCREMENT,\n"
                + "	uname text NOT NULL,\n"
                + "	pscore integer NOT NULL,\n"
                + "	npcscore integer NOT NULL,\n"
                + "	gametime integer NOT NULL DEFAULT CURRENT_TIMESTAMP\n"
                + ");";
		
		String sessions = "CREATE TABLE sessions (\n"
                + "	id integer PRIMARY KEY AUTOINCREMENT,\n"
                + "	uname text NOT NULL,\n"
                + "	sessionid text NOT NULL,\n"
                + "	startTime integer NOT NULL,\n"
                + "	endTime integer\n"
                + ");";
		
		try {
			Connection conn = DriverManager.getConnection(Config.getDbLoc());
			Statement stmt = conn.createStatement();			
			stmt.execute(users);
			stmt.execute(games);
			stmt.execute(sessions);
			
			stmt.close();
			conn.close();
			
		}
		catch (SQLException e) { System.out.println("Exception: " + e.getMessage()); e.printStackTrace(); }
	}
}
