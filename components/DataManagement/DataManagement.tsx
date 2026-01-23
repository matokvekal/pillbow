import React, { useRef } from 'react';
import { loadAppData, saveAppData } from '../../services/dataService';
import './DataManagement.css';

export const DataManagement: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportData = () => {
        try {
            const appData = loadAppData();
            const dataStr = JSON.stringify(appData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            // Format: pillbow-backup-YYYY-MM-DD.json
            link.download = `pillbow-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert('✓ Your data has been saved successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            alert('❌ Failed to export data. Please try again.');
        }
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Show warning first
        const confirmed = window.confirm(
            '⚠️ This will REPLACE all your current medication data.\n\nAre you sure you want to restore from this backup?'
        );

        if (!confirmed) {
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);

                // Basic validation
                if (!importedData.medications || !Array.isArray(importedData.medications)) {
                    throw new Error('Invalid backup file format');
                }

                saveAppData(importedData);
                alert('✓ Data imported successfully!');
                window.location.reload(); // Reload to show imported data
            } catch (error) {
                console.error('Import failed:', error);
                alert('❌ Error: Invalid backup file. Please make sure this is a valid PillBow backup.');
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="data-management">
            <h2 className="data-management__title">📊 MY DATA</h2>

            <p className="data-management__description">
                Backup your data or restore from a file. useful for switching devices or sharing with family.
            </p>

            <button
                className="data-action-button data-action-button--export"
                onClick={handleExportData}
            >
                <span className="data-action-button__icon">📤</span>
                <div className="data-action-button__content">
                    <h3>EXPORT MY DATA</h3>
                    <p>Download all medication info as a backup file</p>
                </div>
            </button>

            <button
                className="data-action-button data-action-button--import"
                onClick={() => fileInputRef.current?.click()}
            >
                <span className="data-action-button__icon">📥</span>
                <div className="data-action-button__content">
                    <h3>IMPORT DATA</h3>
                    <p>Restore data from a backup file</p>
                </div>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImportData}
            />
        </div>
    );
};
