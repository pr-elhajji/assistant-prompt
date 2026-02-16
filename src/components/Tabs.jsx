import React from 'react';

const Tabs = ({ templates, activeTab, onTabChange }) => {
    return (
        <div className="tabs-nav">
            {templates.map(tabId => (
                <button
                    key={tabId}
                    className={`tab-btn ${activeTab === tabId ? 'active' : ''}`}
                    onClick={() => onTabChange(tabId)}
                >
                    {tabId}
                </button>
            ))}
            {/* Hardcode IMAGES if not in templates parsing logic, or ensure it's passed */}
        </div>
    );
};

export default Tabs;
