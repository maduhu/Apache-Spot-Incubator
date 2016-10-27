var React = require('react');

var SpotConstants = require('../../js/constants/SpotConstants');
var SpotActions = require('../../js/actions/SpotActions');
var EdInActions = require('../../js/actions/EdInActions');
var SpotUtils = require('../../js/utils/SpotUtils');

// Build and Render Toolbar
var FilterInput = require('./components/FilterInput.react');
var DateInput = require('../../js/components/DateInput.react');

function resetFilterAndReload()
{
  EdInActions.setFilter('');
  EdInActions.reloadSuspicious();
};

React.render(
  (
    <form className="form-inline">
      <div className="form-group">
        <label htmlFor="ip_filter" className="control-label">IP/DNS:</label>
        <div className="input-group input-group-xs">
          <FilterInput id="ip_filter" />
          <div className="input-group-btn">
            <button className="btn btn-primary" type="button" id="btn_searchIp" title="Enter an IP Address or Domain and click the search button to filter the results." onClick={EdInActions.reloadSuspicious}>
              <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="dataDatePicker" className="control-label">Data Date:</label>
        <div className="input-group input-group-xs">
          <DateInput id="dataDatePicker" onChange={resetFilterAndReload} />
          <div className="input-group-btn">
            <button className="btn btn-default" type="button" title="Reset filter" id="reset_ip_filter" onClick={resetFilterAndReload}>
              <span className="glyphicon glyphicon-repeat" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </form>
  ),
  document.getElementById('nav_form')
);

// Build and Render Edge Investigation's panels
var PanelRow = require('../../js/components/PanelRow.react');
var Panel = require('../../js/components/Panel.react');

var SuspiciousPanel = require('./components/SuspiciousPanel.react');
var NetworkViewPanel = require('./components/NetworkViewPanel.react');
var IPythonNotebookPanel = require('../../js/components/IPythonNotebookPanel.react');
var DetailsPanel = require('./components/DetailsPanel.react');

var ipynbClosure = IPythonNotebookPanel.createIPythonNotebookClosure(SpotConstants.NOTEBOOK_PANEL);

React.render(
  <div id="spot-content">
    <PanelRow>
      <Panel title={SpotConstants.SUSPICIOUS_PANEL} expandable reloadable onReload={EdInActions.reloadSuspicious}>
        <SuspiciousPanel />
      </Panel>
      <Panel title={SpotConstants.NETVIEW_PANEL} container expandable reloadable onReload={EdInActions.reloadSuspicious}>
        <NetworkViewPanel />
      </Panel>
    </PanelRow>
    <PanelRow>
      <Panel title={ipynbClosure.getTitle()} container extraButtons={ipynbClosure.getButtons}>
        <IPythonNotebookPanel title={ipynbClosure.getTitle()} date={SpotUtils.getCurrentDate()} ipynb="dns/${date}/Edge_Investigation.ipynb" />
      </Panel>
      <Panel title={SpotConstants.DETAILS_PANEL} container expandable>
        <DetailsPanel title={SpotConstants.DETAILS_PANEL} />
      </Panel>
    </PanelRow>
  </div>,
  document.getElementById('spot-content-wrapper')
);

var initial_filter = SpotUtils.getCurrentFilter();

// Set search criteria
SpotActions.setDate(SpotUtils.getCurrentDate());
initial_filter && EdInActions.setFilter(initial_filter);

// Load data
EdInActions.reloadSuspicious();

// Create a hook to allow notebook iframe to reloadSuspicious
window.iframeReloadHook = EdInActions.reloadSuspicious;