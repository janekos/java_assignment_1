package root;

public class Config {
	
	private static String dbDir = System.getProperty("user.dir") + "\\db";
	private static String dbLoc = "jdbc:sqlite:" + dbDir + "\\db.db";
	private static int activeTime = 1;
	
	public static String getDbLoc() { return dbLoc; }
	public static String getDbDir() { return dbDir; }
	public static int getActiveTime() { return activeTime; }
	
	public static void setDbLoc(String dbLoc) { Config.dbLoc = dbLoc; }
	public static void setDbDir(String dbDir) { Config.dbDir = dbDir; }
	public static void setActiveTime(int activeTime) { Config.activeTime = activeTime; }
}
