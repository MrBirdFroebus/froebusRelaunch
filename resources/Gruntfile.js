module.exports = function(grunt) {
	
	var globalConfig = {
		css:			'../public_html/css',
		scss:			'scss',
		fonts:			'../public_html/fonts',
		scripts:		'../public_html/js',
		scripts_src:	'js',
		images:			'../public_html/images',
		images_src:		'images'
	};
	
	require('load-grunt-tasks')(grunt);
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		globalConfig: globalConfig,
		
		// https://github.com/gruntjs/grunt-contrib-compass
		// sudo npm install grunt-contrib-compass --save-dev
		
		compass: {
			dist: {
				options: {
					httpPath: "/",
					cssDir: "<%= globalConfig.css %>",
					sassDir: "<%= globalConfig.scss %>",
					imagesDir: "<%= globalConfig.images %>",
					relativeAssets: true ,
					outputStyle:"compressed",
					noLineComments: true
				}
			}
		},
		
		// sudo npm install grunt-contrib-sass --save-dev
		
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'<%= globalConfig.css %>/main.min.css': '<%= globalConfig.scss %>/main.scss'
				}
			}
		}, 
		
		// sudo npm install grunt-contrib-copy --save-dev
		
		copy: {
			styles: {
				files: [{
					expand:true,
					cwd: 'node_modules/bootstrap/dist/css/',
					src:['bootstrap.min.css','bootstrap.min.css.map'],
					dest:'<%= globalConfig.css %>/'
				}]
			},
			fonts: {
				files: [{
					expand:true,
					cwd: 'node_modules/bootstrap/dist/fonts/',
					src:['**'],
					dest:'<%= globalConfig.fonts %>/'
				}]
			},
			scripte: {
				files: [{
					expand:true,
					cwd: 'node_modules/bootstrap/dist/js/',
					src:['bootstrap.min.js'],
					dest:'<%= globalConfig.scripts %>/'
				}]
			},
		},
		
		// https://github.com/gruntjs/grunt-contrib-concat
		// sudo npm install grunt-contrib-concat --save-dev
		concat: {
			dist: {
				// Welche Dateien sollen zusammengefasst werden?
				// In welcher Reihenfolge?
				src: [
					'<%= globalConfig.scripts_src %>/jquery-1.11.2.js',
					'<%= globalConfig.scripts_src %>/**/*.js'
				],
				// Wohin soll die konkatenierte Datei gespeichert werden?
				dest: '<%= globalConfig.scripts %>/main.min.js'
			}
		},
		
		// https://github.com/gruntjs/grunt-contrib-uglify
		uglify: {
			development: {
				options: {
					// Erstellt eine sourceMap, mit der in der
					// Browser Console die richtige Code-Zeile
					// für Debug-Zwecke gefunden werden kann.
					sourceMap: false
				},
				// Wohin soll die Uglify-Datei gespeichert werden?
				files: {
					'<%= globalConfig.scripts %>/main.min.js': ['<%= globalConfig.scripts %>/main.min.js']
				}
			}
		},
		
		// https://github.com/gruntjs/grunt-contrib-watch
		// Was soll automatisch passieren, wenn der Task angestoßen wurde?
		// sudo npm install grunt-contrib-watch --save-dev
		watch: {
			// Beim Speichern von .scss Dateien
			css: {
				files: ['<%= globalConfig.scss %>/**/*.scss'],
				tasks: ['sass']
			},
			// Beim Speichern von Bootstrap
			bootstrap: {
				files: ['node_modules/bootstrap/**/*.scss'],
				tasks: ['sass']
			},
			// Beim Speichern von .js Dateien
			
			//scripts: {
			//	files: '<%= globalConfig.scripts_src %>/**/*.less',
			//	tasks: ['copy']
			//}
		},
	
		// https://github.com/andismith/grunt-responsive-images
		// sudo npm install grunt-responsive-images --save-dev
		responsive_images: {
			retina: {
				options: {
					// Benutze Library: im = ImageMagick, gm = GraphicsMagick
					engine: 'gm',
					separator: '',
					sizes: [{
						// Original-Namen behalten
						rename: false,
						quality: 85,
						// Die Bilder werden in ihrer Größe halbiert.
						width: '50%'
					},{
						rename: false,
						quality: 85,
						width: '100%',
						// Für die Retina-Bilder wird ein Suffix vergeben,
						// das an den Originalnamen angehängt wird.
						suffix: '@2x'
					}]
				},
				files: [{
					expand: true,
					// Welche Dateitypen sollen von diesem Task überhaupt betroffen sein?
					src: ['**/**.{jpg,gif,png}'],
					// Ausgangsorder, hier liegen die Originaldateien.
					cwd: '<%= globalConfig.images_src %>/',
					// Zielordner, hier werden die Bilder abgelegt.
					dest: '<%= globalConfig.images %>/'
				}]
			}
		},
		
		// https://github.com/gruntjs/grunt-contrib-imagemin
		// sudo npm install grunt-contrib-imagemin --save-dev
		// Beispielbilder von Raumrot http://www.raumrot.com/
		imagemin: {
			png: {
				options: {
					optimizationLevel: 7
				},
				files: [{
					expand: true,
					src: ['**/*.png'],
					cwd: '<%= globalConfig.images %>',
					dest: '<%= globalConfig.images %>'
				}]
			},
			jpg: {
				options: {
					progressive: true
				},
				files: [{
					expand: true,
					src: ['**/*.{jpg,jpeg}'],
					cwd: '<%= globalConfig.images %>',
					dest: '<%= globalConfig.images %>'
				}]
			}
		},
		
		// https://www.npmjs.com/package/grunt-favicons
		// sudo npm install grunt-favicons --save-dev
		// Ausgangsdatei
		// 310px x 310px
		favicons : {
			options: {
				// Hintergrundfarbe für das Apple Touch Icon
				appleTouchBackgroundColor: "#ff9c1a",
				// Erstelle ein Icon für den Android Home Screen
				androidHomescreen: true,
				// Erstelle eine HTML-Datei, in der alle notwendigen Meta-Tags eingebunden sind.
				html: '<%= globalConfig.images %>/favicon-test.html',
				HTMLPrefix: "",
				// Tile Farbe für Windows
				tileColor: "#000000",
				// Das muss auf false gesetzt werden, damit die tileColor Einstellung greift.
				tileBlackWhite: false
			},
			icons: {
				src: '<%= globalConfig.images_src %>/fav_vorlage.png',
				dest: '<%= globalConfig.images %>'
			}
		},
		
		// https://www.npmjs.com/package/grunt-browser-sync
		// sudo npm install grunt-browser-sync --save-dev
		// http://www.browsersync.io/docs/options/
		browserSync: {
			// Wenn Änderungen an diesen Dateien festegestellt werden, lade alle Fenster neu!
			bsFiles: {
				src : [
					'../public_html/css/*.css',
					'../public_html/*.html'
				]
			},
			options: {
				debugInfo: true,
				logConnections: true,
				notify: true,
				// Wie die Webseite im Browser aufgerufen wird.
				// Kann ebenso localhost oder eine IP sein.
				// ACHTUNG: Domains mit .local funktionieren nicht richtig!
				proxy: "grunt-webseite.dev",
				// Öffne die Seite in folgenden Browsern
				browser: ["google chrome", "firefox", "safari"],
				ghostMode: {
					// Scrolle auf allen Geräten
					scroll: true,
					// Folge den Links auf allen Geräten
					links: true,
					// Fülle die Formulare auf allen Geräten aus
					forms: true
				}
			}
		},
		
		// https://github.com/sindresorhus/grunt-shell
		// sudo npm install --save-dev grunt-shell
		shell: {
			workflow: {
				command: [
					'cd ..',
					'git pull',
					'cd resources/',
					'grunt'
				].join('&&')
			},
			installTypo3: {
				command: [
					'cd ..',
					'git submodule add git://git.typo3.org/Packages/TYPO3.CMS.git typo3_src',
					'cd typo3_src',
					'git checkout tags/TYPO3_8-2-1',
					'cd ../public_html',
					'ln -s ../typo3_src/index.php',
					'ln -s ../typo3_src/typo3',
					'push FIRST_INSTALL'
				].join('&&')
			},
			typo3Update: {
				command: [
					'cd ..',
					'cd typo3_src',
					'git checkout tags/TYPO3_7-6-10',
					'cd resources/',
				].join('&&')
			},
			push: {
				command: [
					'cd ..',
					'git add .',
					'git commit -m "Automatischer Upload"',
					'git push origin master',
					'cd resources/',
				].join('&&')
			}
		},
		
		
		
	});
	
	// Default task(s).
	grunt.registerTask('watch', ['watch']);
	grunt.registerTask('default', ['copy']);
	grunt.registerTask('optimize-images', ['responsive_images', 'imagemin']);
	grunt.registerTask('generate-touch-icons', ['favicons']);
	grunt.registerTask('browser-sync', ['browserSync']);
	grunt.registerTask('start-working', ['shell:workflow']);
	grunt.registerTask('install-typo3', ['shell:installTypo3']);
	grunt.registerTask('update-typo3', ['shell:typo3Update']);
	grunt.registerTask('push', ['shell:push']);
};