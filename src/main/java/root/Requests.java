package root;

import static spark.Spark.*;

import java.io.File;

public class Requests {

	public static void main(String[] args) {
		
		File f = new File(Config.getDbDir() + "\\database.db");
		if(!f.exists() || f.isDirectory()) {
			DatabaseMethods.createNewDb();
		}
		
		port(6789);
		
		path("/calc", () -> {
			get("/roll/:user", (req, res)->{
				System.out.println(req.params(":user"));
				return GameHandler.rollDice();
			});
			// get dice rolls and return them (player must exist (?) and in session)
		});
		path("/db", () -> {
			//post user creation
			post("/create/user/*/pw/*", (req, res)->{
				//user = req.splat()[0]
				//pw = req.splat()[1]
				System.out.println(req.splat()[0] + " " + req.splat()[1]);
				return "";
			});
			get("/auth/user/*/pw/*", (req, res)->{
				System.out.println(req.splat()[0] + " " + req.splat()[1]);
				return "";
			});
			
			//get auth user (validate and return scores from previous plays)
			// session tracking
		});

	}

}
