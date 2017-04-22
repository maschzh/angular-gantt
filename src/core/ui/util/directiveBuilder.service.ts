export default function ($templateCache) {
  'ngInject';
  let DirectiveBuilder = function DirectiveBuilder(directiveName, templateUrl, require, restrict) {
    let self = this;

    this.directiveName = directiveName;
    this.templateUrl = templateUrl === undefined ? 'template/' + directiveName + '.tmpl.html' : templateUrl;
    this.require = require === undefined ? '^gantt' : require;
    this.restrict = restrict === undefined ? 'E' : restrict;
    this.scope = false;
    this.transclude = true;
    this.replace = true;

    this.build = function () {
      let directiveName = self.directiveName;
      let templateUrl = self.templateUrl;
      let controllerFunction = self.controller;

      let directive = {
        restrict: self.restrict,
        require: self.require,
        transclude: self.transclude,
        replace: self.replace,
        scope: self.scope,
        templateUrl: function (tElement, tAttrs) {
          if (tAttrs.templateUrl !== undefined) {
            templateUrl = tAttrs.templateUrl;
          }
          if (tAttrs.template !== undefined) {
            $templateCache.put(templateUrl, tAttrs.template);
          }
          return templateUrl;
        },
        compile: function () {
          return {
            pre: function preLink(scope, iElement, iAttrs, controller) {
              scope.gantt.api.directives.raise.preLink(directiveName, scope, iElement, iAttrs, controller);
            },
            post: function postLink(scope, iElement, iAttrs, controller) {
              scope.gantt.api.directives.raise.postLink(directiveName, scope, iElement, iAttrs, controller);

            }
          };
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          let controller = this;

          if (controllerFunction !== undefined) {
            controllerFunction($scope, $element, $attrs, controller);
          }

          $scope.gantt.api.directives.raise.controller(directiveName, $scope, $element, $attrs, controller);
          $scope.$on('$destroy', function () {
            $scope.gantt.api.directives.raise.destroy(directiveName, $scope, $element, $attrs, controller);
          });

          $scope.$applyAsync(function () {
            $scope.gantt.api.directives.raise.new(directiveName, $scope, $element, $attrs, controller);
          });
        }]
      };

      if (!templateUrl) {
        delete directive.templateUrl;
        delete directive.replace;
        delete directive.transclude;
      }

      return directive;
    };
  };

  return DirectiveBuilder;
}