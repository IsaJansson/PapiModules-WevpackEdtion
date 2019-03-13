﻿// This JavaScript file is created by Cision for our ownership module.
// Built to be used in combination with ownership.html

var cision = cision || {};
cision.websolution = cision.websolution || {};
cision.websolution.texts = cision.websolution.texts || {};
cision.websolution.settings = cision.websolution.settings || {};
cision.websolution.formatHelpers = cision.websolution.formatHelpers || {};

cision.websolution.ownership = !cision.websolution.settings.ownership ? {} : function ($) {
    var settings = $.extend({}, cision.websolution.settings.general),
        accessKey = cision.websolution.settings.ownership.accessKey,
        texts = cision.websolution.texts[settings.uiLanguage];

    var renderLargestShareholders = function (options) {
        if (options) {
            $.extend(settings, options);
        }
        if (!accessKey) {
            console.log("You must provide your ownership access key.");
            return;
        }

        var promiseOwnership = cision.websolution.common.getModuleData({ 'accessKey': accessKey, 'module': "Ownership Largest shareholders", 'path': 'Ownership/' + accessKey });

        return Promise.resolve(promiseOwnership).then(function (rawData) {
            rawData.TotalAmount = rawData.ShareHolders.length;
            rawData.DateFormatted = moment(rawData.Date).format(settings.dateFormatOptions.dateFormat);
            rawData.AmountInList = settings.LargestListShowCount;

            renderLargestShareholdersChart(rawData);

            var tplElement = '#' + (settings.templateElement || 'tplLargestShareholdersListing');
            var tplTarget = '#' + (settings.outputTargetElement || 'target-largestshareholders');
            cision.websolution.common.modelToHtml(rawData, tplElement, tplTarget);

        }).catch(function (err) { console.log('Could not retrieve ownership data for largest shareholders. ' + err.message) });
    };

    function renderOwnershipTab(name) {
        //prevent tab rendering if it is already rendered
        if (settings.ownershipTabLoaded[name] != null) {
            return;
        }

        switch (name) {
            case "#target-largest": if (true) {
                renderLargestShareholders();
            }
            else { }
                break;
            case "#target-sharesizegroups": if (true) {
                renderShareSizeGroups();
            }
            else { }
                break;
            case "#target-area": if (true) {
                renderShareHolderAreas();
            }
            else { }
                break;
            case "#target-grouped": if (true) {
                renderLargestGroupedShareholders();
            }
            else { }
                break;
            default:
        }

        //save value that tab has been rendered
        settings.ownershipTabLoaded[name] = true;
    }

    function getChartOptions(rawData, dataArray) {
        return { // make into setting
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            credits: {
                text: 'Source Cision/Euroclear'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: rawData.Name,
                data: dataArray
            }]
        };
    }

    var renderLargestShareholdersChart = function (rawData) {
        // Build Data Series
        var dataArray = [],
            othersPercent = 100;
        $.each(rawData.ShareHolders, function (ix, objShareHolder) {
            if (objShareHolder.Number <= settings.LargestPieShowCount) {
                othersPercent -= objShareHolder.OwnershipPercent;

                dataArray.push({
                    name: objShareHolder.Name,
                    y: objShareHolder.OwnershipPercent
                });
            }
        });

        if (othersPercent > 0) {
            dataArray.push({
                name: 'Others',
                y: othersPercent,
                sliced: true
            });
        }
        var chartOptions = getChartOptions(rawData, dataArray);
        $('#container-largest-shareholders-chart').highcharts(chartOptions);
    };

    var renderNewShareholders = function (options) {
        if (options) {
            $.extend(settings, options);
        }
        if (!accessKey) {
            console.log("You must provide your ownership access key.");
            return;
        }

        var promiseOwnership = cision.websolution.common.getModuleData({ 'accessKey': accessKey, 'module': "Ownership new shareholders", 'path': 'Ownership/' + accessKey + '/NewShareHolders' });

        return Promise.resolve(promiseOwnership).then(function (rawData) {
            rawData.DateFormatted = moment(rawData.Date).format('ll');

            var tplElement = '#' + (settings.templateElement || 'tplNewShareholdersListing');
            var tplTarget = '#' + (settings.outputTargetElement || 'target-newshareholders');
            cision.websolution.common.modelToHtml(rawData, tplElement, tplTarget);

        }).catch(function (err) { console.log('Could not retrieve ownership data for new shareholders. ' + err.message) });
    };

    var renderShareSizeGroups = function (options) {
        if (options) {
            $.extend(settings, options);
        }
        if (!accessKey) {
            console.log("You must provide your ownership access key.");
            return;
        }

        var promiseOwnership = cision.websolution.common.getModuleData({ 'accessKey': accessKey, 'module': "Ownership size groups", 'path': 'Ownership/' + accessKey + '/ShareSizeGroups'});

        return Promise.resolve(promiseOwnership).then(function (rawData) {
            rawData.DateFormatted = moment(rawData.Date).format('ll');

            var tplElement = '#' + (settings.templateElement || 'tplShareSizeGroupsListing');
            var tplTarget = '#' + (settings.outputTargetElement || 'target-sharesizegroups');
            cision.websolution.common.modelToHtml(rawData, tplElement, tplTarget);

        }).catch(function (err) { console.log('Could not retrieve ownership data for share size groups. ' + err.message) });
    };

    var renderShareHolderAreas = function (options) {
        if (options) {
            $.extend(settings, options);
        }
        if (!accessKey) {
            console.log("You must provide your ownership access key.");
            return;
        }

        var promiseOwnership = cision.websolution.common.getModuleData({ 'accessKey': accessKey, 'module': "Ownership shareholder areas", 'path': 'Ownership/' + accessKey + '/ShareHolderAreas' });

        return Promise.resolve(promiseOwnership).then(function (rawData) {
            // Trying to reorder Areas so that they are translatable
            // The available areas are: Sweden, USA, Nordic, Europe, World
            var reorderedAreas = [];
            settings.ownershipAreasNames = settings.ownershipAreasNames || {};
            var textsAreaNames = texts.TextOwnershipAreaNames || {};

            var objAreaSweden = _.findWhere(rawData.Areas,
                {
                    AreaName: settings.ownershipAreasNames.sweden || 'SVERIGEBOENDE'
                });
            if (objAreaSweden) {
                objAreaSweden.AreaName = textsAreaNames.Sweden || objAreaSweden.AreaName;
                reorderedAreas.push(objAreaSweden);
            }

            var objAreaUsa = _.findWhere(rawData.Areas,
                {
                    AreaName: settings.ownershipAreasNames.usa || 'USA'
                });
            if (objAreaUsa) {
                objAreaUsa.AreaName = textsAreaNames.Usa || objAreaUsa.AreaName;
                reorderedAreas.push(objAreaUsa);
            }

            var objAreaNordic = _.findWhere(rawData.Areas,
                {
                    AreaName: settings.ownershipAreasNames.nordic || 'ÖVRIGA NORDEN'
                });
            if (objAreaNordic) {
                objAreaNordic.AreaName = textsAreaNames.Nordic || objAreaNordic.AreaName;
                reorderedAreas.push(objAreaNordic);
            }

            var objAreaEurope = _.findWhere(rawData.Areas,
                {
                    AreaName: settings.ownershipAreasNames.europe || 'ÖVRIGA EUROPA (EXKL SVERIGE OCH NORDEN)'
                });
            if (objAreaEurope) {
                objAreaEurope.AreaName = textsAreaNames.Europe || 'ÖVRIGA EUROPA' /* objAreaEurope.AreaName */;
                reorderedAreas.push(objAreaEurope);
            }

            var objAreaWorld = _.findWhere(rawData.Areas,
                {
                    AreaName: settings.ownershipAreasNames.world || 'ÖVRIGA VÄRLDEN'
                });
            if (objAreaWorld) {
                objAreaWorld.AreaName = textsAreaNames.World || objAreaWorld.AreaName;
                reorderedAreas.push(objAreaWorld);
            }

            var objAreaTotal = _.findWhere(rawData.Areas, { OwnershipPercent: 100 });
            if (objAreaTotal) {
                objAreaTotal.AreaName = textsAreaNames.Total || objAreaTotal.AreaName;
            }

            rawData.Areas = reorderedAreas;
            rawData.Total = objAreaTotal;

            rawData.DateFormatted = moment(rawData.Date).format('ll');

            renderShareHolderAreasChart(rawData);

            var tplElement = '#' + (settings.templateElement || 'tplShareShareHolderAreasListing');
            var tplTarget = '#' + (settings.outputTargetElement || 'target-shareholderareas');
            cision.websolution.common.modelToHtml(rawData, tplElement, tplTarget);

        }).catch(function (err) { console.log('Could not retrieve ownership data for shareholder areas. ' + err.message) });
     
    };

    var renderShareHolderAreasChart = function (rawData) {
        // Build Data Series
        var dataArray = [];

        $.each(rawData.Areas, function (ix, objArea) {
            if (objArea.OwnershipPercent < 100) {
                dataArray.push({
                    name: objArea.AreaName,
                    y: objArea.OwnershipPercent
                });
            }
        });
        var chartOptions = getChartOptions(rawData, dataArray);
        $('#target-shareholderareas-chart').highcharts(chartOptions);
    };

    var renderLargestGroupedShareholders = function (options) {
        if (options) {
            $.extend(settings, options);
        }
        if (!accessKey) {
            console.log("You must provide your ownership access key.");
            return;
        }

        var promiseOwnership = cision.websolution.common.getModuleData({ 'accessKey': accessKey, 'module': "Ownership largest grouped shareholders", 'path': 'Ownership/' + accessKey + '/LargestGroupedShareHolders' });

        return Promise.resolve(promiseOwnership).then(function (rawData) {
            rawData.TotalAmount = rawData.ShareHolders.length;
            rawData.DateFormatted = moment(rawData.Date).format('ll');

            rawData.AmountInList = settings.LargestListShowCount;
            renderLargestGroupedShareholdersChart(rawData);

            var tplElement = '#' + (settings.templateElement || 'tplLargestShareholdersListing');
            var tplTarget = '#' + (settings.outputTargetElement || 'target-largestgroupedshareholders');
            cision.websolution.common.modelToHtml(rawData, tplElement, tplTarget);

        }).catch(function (err) { console.log('Could not retrieve ownership data for largest grouped shareholders. ' + err.message) });
    };

    var renderLargestGroupedShareholdersChart = function (rawData) {
        // Build Data Series
        var dataArray = [],
            othersPercent = 100;
        //        options.LargestPieShowCount = 10;
        $.each(rawData.ShareHolders, function (ix, objShareHolder) {
            if (objShareHolder.Number <= settings.LargestPieShowCount) {
                othersPercent -= objShareHolder.OwnershipPercent;

                dataArray.push({
                    name: objShareHolder.Name,
                    y: objShareHolder.OwnershipPercent
                });
            }
        });

        if (othersPercent > 0) {
            dataArray.push({
                name: 'Others',
                y: othersPercent,
                sliced: true
            });
        }

        var chartOptions = getChartOptions(rawData, dataArray);
        $('#container-largest-grouped-shareholders-chart').highcharts(chartOptions);
    };

    return {
        renderLargestShareholders: renderLargestShareholders,
        renderNewShareholders: renderNewShareholders,
        renderShareSizeGroups: renderShareSizeGroups,
        renderShareHolderAreas: renderShareHolderAreas,
        renderShareHolderAreasChart: renderShareHolderAreasChart,
        renderLargestGroupedShareholders: renderLargestGroupedShareholders,
        renderOwnershipTab: renderOwnershipTab
    };

}(jQuery);