package root;

public class Config {
	
	private static String dbDir = System.getProperty("user.dir") + "\\db";
	private static String dbLoc = "jdbc:sqlite:" + dbDir + "\\db.db";
	
	public static String getDbLoc() { return dbLoc; }
	public static String getDbDir() { return dbDir; }
	
	public static void setDbLoc(String dbLoc) { Config.dbLoc = dbLoc; }
	public static void setDbDir(String dbDir) { Config.dbDir = dbDir; }
}
