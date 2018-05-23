package root;

import static spark.Spark.*;

import java.io.File;

public class Requests {

	public static void main(String[] args) {
		
		File f = new File(Config.getDbDir() + "\\db.db");
		if(!f.exists() || f.isDirectory()) {
			DatabaseMethods.createNewDb();
		}
		
		port(6789);
		enableCORS("*", "*", "*");		
		
		path("/calc", () -> {
			post("/roll", (req, res) -> GameHandler.rollDice());
		});
		path("/db", () -> {
			post("/create/user/*/pw/*", "*/*", (req, res) -> PlayerHandler.createPlayer(req.splat()[0], req.splat()[1]));
			get("/auth/user/*/pw/*", (req, res) -> PlayerHandler.authPlayer(req.splat()[0], req.splat()[1]));
			// session tracking
		});

	}
	
	private static void enableCORS(final String origin, final String methods, final String headers) {

	    options("/*", (request, response) -> {

	        String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
	        if (accessControlRequestHeaders != null) {
	            response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
	        }

	        String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
	        if (accessControlRequestMethod != null) {
	            response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
	        }

	        return "OK";
	    });

	    before((request, response) -> {
	        response.header("Access-Control-Allow-Origin", origin);
	        response.header("Access-Control-Request-Method", methods);
	        response.header("Access-Control-Allow-Headers", headers);
	        response.type("text/html;");
	    });
	}

}
