Harmony Rapid Address (HRA) examples
=================================
This document gives you a quick jump-start to use JavaScript to query [Mastersoft Group](http://www.mastersoftgroup.com) HRA Restful services.

### How to use the project
This document gives you a quick jump-start to use JavaScript to query HRA Restful services. There are two ways to use the projects:

 - If you just want to try with a working example without the hassle of setting up the environment, select [releases](https://github.com/MastersoftGroup/hra-sample/releases) and download the version you are interested in to deploy on your local *HTTP* server.

	> Please note that you will need to update the credential in examples in order to make they work properly.

 - If you want to experiment the examples (for example, using different versions of the dependency), please clone the projects and change the build settings in *Gruntfile.js*

	```shell
	grunt #to build the project.
	grunt dist #to build a *dist* version of the project.
	grunt --help #to see all available tasks.
	```

### Files
`sample-address-lookup-autocomplete-jquery.html`
a simple example using only jQuery to demo how to make cross-domain requests to the service.

`sample-address-lookup-autocomplete-harmony_js.html`
an example using Mastersoft library to request the service.

`sample-address-lookup-autocomplete-angular_directive.html`
an example using Angular JS (1.x) *directive* to request the service.

`sample-address-lookup-autocomplete-angular_service.html`
an example using Angular JS (1.x) *service* to request the service.

### API documents
The more detailed document can be found at http://developer.mastersoftgroup.com/harmony/api/method/address.html.
