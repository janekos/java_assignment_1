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
                + "	uname text NOT NULL,\n"
                + "	pw text NOT NULL\n"
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
			stmt.execute(sessions);
			
		}
		catch (SQLException e) { System.out.println("Exception: " + e.getMessage()); e.printStackTrace(); }
	}
}
