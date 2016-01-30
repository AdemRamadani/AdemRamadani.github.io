var mozjpeg = require('imagemin-mozjpeg');

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		imagemin: {
			img: {
				files: [{
					expand: true,
					src: ['img/*.{png,jpg,gif}']
				}]
			}
		},
		responsive_images: {
			profile: {
				options: {
					engine: 'im',
					sizes: [
						{
							width: '70px',
							quality: 20
						}
					]
				},
				files: [{
					expand: true,
					src: ['img/profilepic.jpg']
				}]
			},
			thumbs: {
				options: {
					engine: 'im',
					sizes: [
						{
							width: '100px',
							quality: 20
						}
					]
				},
				files: [{
					expand: true,
					src: ['views/images/pizzeria.jpg']
				}]
			},
			all: {
				options: {
					engine: 'im',
					sizes: [
						{
							name: 'small',
							width: '30%',
							quality: 20
						},
						{
							name: 'large',
							width: '50%',
							quality: 40
						}
					]
				},
				files: [{
					expand: true,
					src: [
						'img/cam*.{gif,jpg,png}', 
						'img/2048*.{gif,jpg,png}', 
						'img/mobile*.{gif,jpg,png}', 
						'views/images/pizza.{gif,jpg,png}'
					]
				}]
			}
		},
		run: {
			server: {
				args: ['./node_modules/http-server/bin/http-server'],
				options: {
					passArgs: [
						'-c18000' // turns on caching, defualt 3600(sec)
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-responsive-images');
	grunt.registerTask('default', ['responsive_images']);

};