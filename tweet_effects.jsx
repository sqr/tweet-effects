{
	function TweetEffects()
	{
		// indexOf Polyfill because ExtendScript doesn't support it
		if (!Array.prototype.indexOf) { Array.prototype.indexOf = function indexOf(member, startFrom) { /* In non-strict mode, if the `this` variable is null or undefined, then it is set to the window object. Otherwise, `this` is automatically converted to an object. In strict mode, if the `this` variable is null or undefined, a `TypeError` is thrown. */ if (this == null) { throw new TypeError("Array.prototype.indexOf() - can't convert `" + this + "` to object"); } var index = isFinite(startFrom) ? Math.floor(startFrom) : 0, that = this instanceof Object ? this : new Object(this), length = isFinite(that.length) ? Math.floor(that.length) : 0; if (index >= length) { return -1; } if (index < 0) { index = Math.max(length + index, 0); } if (member === undefined) { /* Since `member` is undefined, keys that don't exist will have the same value as `member`, and thus do need to be checked. */ do { if (index in that && that[index] === undefined) { return index; } } while (++index < length); } else { do { if (that[index] === member) { return index; } } while (++index < length); } return -1; };}
		var scriptName = "Tweet Effects";

        var originFolder = "\\tweets"; // Name of the folder where JSON and JPG files are
        var tweetFolder = "00000_tweets"; // Name of the folder in the project where the tweets will be
        var compFolder = "00000_comps"; // Name of the folder in the project where the comps will be

        var path = app.project.file.path;
		var originFolderPath = Folder(path + originFolder);
        var originFolderFiles = originFolderPath.getFiles();
        var myProject = app.project;        

		function processFile(theFile) {
            try {
                var importOptions = new ImportOptions(theFile); // Create a variable containing ImportOptions.
                importSafeWithError(importOptions);
            } catch (error) { // Ignore errors.
            }
		}

		function importSafeWithError(importOptions) {
			try { 
				app.project.importFile(importOptions);
			} catch (error) {
				alert(error.toString() + importOptions.file.fsName, scriptName);
			}
        }
        
		function processFolder(folder) {
            var filesInFolder = folder.getFiles();
            for (index in filesInFolder) {
                if (filesInFolder[index] instanceof File) {
                    processFile(filesInFolder[index]); // Import files from origin folder
                }
                if (filesInFolder[index] instanceof Folder) {
                    processFolder(filesInFolder[index]); // Import subfolders from origin folder
                }
            }	
		}

		processFolder(originFolderPath);

		function getFolderByName(folderName) {  // Given a folder name, returns the item index in the project
			for (var i = 1; i <= myProject.numItems; i++) {
				if ((myProject.item(i) instanceof FolderItem) && (myProject.item(i).name == folderName)){
					return myProject.item(i);
				}
			}
		}
		
		function getPicByName(picName) {  // Given a footage item name, returns the item index in the project
			for (var i = 1; i <= myProject.numItems; i++) {
				if ((myProject.item(i) instanceof FootageItem) && (myProject.item(i).name == picName)){
					alert(myProject.item(i).name);
					return myProject.item(i);				   
				}
			}
		}

        function createFolder() {
			app.project.items.addFolder(tweetFolder); // Create root folder for the tweets 
			for (i=0; i < originFolderFiles.length ; i++) { 
				var res = String(originFolderFiles[i]).split("/"); // Separate ID from directory
				folderName2 = res.slice(-1)[0]; // Get only the ID
				app.project.items.addFolder(folderName2); // Create folder
				var carpeta = getFolderByName(folderName2);
				var pariente = getFolderByName(tweetFolder);
				carpeta.parentFolder = pariente; // Set the root folder
			}
        }
    
        createFolder();

		for (var i = 1; i <= myProject.numItems; i++) {
			if (myProject.item(i) instanceof FootageItem) {  // Locate footage files
				var shortname = String(myProject.item(i).name).split("."); // Get their name, split to isolate file extension 
				var carpetazo = shortname[0]; // Get only the footage name, discarding file extension
				
				for (var o = 1; o <= myProject.numItems; o++) {
					if ((myProject.item(o) instanceof FolderItem) && (myProject.item(o).name == carpetazo)){ // If a folder has the same name as the footage file
						myProject.item(i).parentFolder = myProject.item(o); // Set that folder as a parent of the footage file
					}
				}
			}
        }

        var carpeta = getFolderByName(tweetFolder);
        var arraysCarpeta = []; // We will store subfolders of tweetFolder here

        for (i=1; i <= carpeta.numItems; i++) { // Loop through subfolders inside tweetFolder
            arraysCarpeta.push(carpeta.item(i).name); // Add the name of the subfolder to the array
        }

        for (i=0; i < arraysCarpeta.length; i++) { // Loop through the array containing subfolder names
            app.project.item(1).duplicate(); // Duplicate the template composition
            app.project.item(2).name = arraysCarpeta[i]; // Assign a name that corresponds with a subfolder to help populate it automatically
        }

        myProject.items.addFolder(compFolder); // Create the folder that will hold all the compositions
        var carpetaComps = getFolderByName(compFolder); // Get its item index

		/* Unused function, for the alternative way of trying to solve it without nested loops

		function getAvatarLayer(avatar, comp) { 
			var avatar = "00_template.jpg";
			for (var i = 1; i <= comp.numLayers; i++) {
				if (comp.layer(i).name == avatar){
					return comp.layer(i);
				}
			}
		}
		*/

        for (var u=1; u < myProject.numItems; u++) { // Loop through all the project items
            if ((myProject.item(u) instanceof CompItem) && (arraysCarpeta.indexOf(myProject.item(u).name) !== -1)){ // If we find a comp that has the same name as one of the items of the array
				for (var k=1; k < myProject.item(u).numLayers; k++) { // Loop through layers
					if (myProject.item(u).layer(k).name == "00_template.jpg") { // Look for the template image
						var avatarItem = getPicByName(myProject.item(u).name+".jpg"); // Fetch the corresponding avatar item to replace
						myProject.item(u).layer(k).replaceSource (avatarItem, false); // Replace 
					}
				}	
				myProject.item(u).parentFolder = carpetaComps; // Set the parent folder of that comp

				/* Alternative way of trying to solve it by using two different functions, leaving for future reference 
				
				var avatarLayer = getAvatarLayer(myProject.item(u).name, myProject.item(u));
				var avatarItem = getPicByName(myProject.item(u).name+".jpg");
				myProject.item(1).layer(3).replaceSource (myProject.item(27), false); */
            } 
		}
	}

	TweetEffects();
}