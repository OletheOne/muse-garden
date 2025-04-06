class IdeaExporter {
    constructor() {
      this.exportFormats = ['json', 'csv', 'text', 'pdf'];
    }
    
    createExportButton(idea, format) {
      const button = document.createElement('button');
      button.className = `export-btn export-${format}`;
      button.textContent = format.toUpperCase();
      button.title = `Export as ${format.toUpperCase()}`;
      
      button.addEventListener('click', () => {
        this.exportIdea(idea, format);
      });
      
      return button;
    }
    
    createExportDropdown(idea) {
      const container = document.createElement('div');
      container.className = 'export-container';
      
      const dropdownButton = document.createElement('button');
      dropdownButton.className = 'export-dropdown-btn';
      dropdownButton.textContent = 'Export';
      
      const dropdownContent = document.createElement('div');
      dropdownContent.className = 'export-dropdown-content hidden';
      
      this.exportFormats.forEach(format => {
        const option = document.createElement('button');
        option.className = `export-option export-${format}`;
        option.textContent = format.toUpperCase();
        option.addEventListener('click', () => {
          this.exportIdea(idea, format);
          dropdownContent.classList.add('hidden');
        });
        
        dropdownContent.appendChild(option);
      });
      
      dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking elsewhere
      document.addEventListener('click', () => {
        dropdownContent.classList.add('hidden');
      });
      
      container.appendChild(dropdownButton);
      container.appendChild(dropdownContent);
      
      return container;
    }
    
    getIdeaText(idea) {
      // Extract idea text from HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = idea.content;
      
      const title = tempDiv.querySelector('h3')?.textContent || 'Creative Idea';
      const description = tempDiv.querySelector('p strong')?.textContent || '';
      const twist = tempDiv.querySelector('.twist')?.textContent || '';
      
      return { title, description, twist };
    }
    
    getAnalysisData(idea) {
      if (!idea.hasAnalysis || !idea.analysis) {
        return null;
      }
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = idea.analysis;
      
      // Extract analysis data
      const overallScore = tempDiv.querySelector('.score-circle')?.textContent.trim() || '';
      
      // Get breakdown scores
      const scores = {};
      tempDiv.querySelectorAll('.score-item').forEach(item => {
        const criterion = item.querySelector('.score-label')?.textContent.trim() || '';
        const score = item.querySelector('.score-value')?.textContent.trim() || '';
        if (criterion && score) {
          scores[criterion] = score;
        }
      });
      
      // Get feedback
      const feedback = [];
      tempDiv.querySelectorAll('.feedback-list li').forEach(item => {
        feedback.push(item.textContent.trim());
      });
      
      // Get recommendations
      const recommendations = [];
      tempDiv.querySelectorAll('.recommendations-list li').forEach(item => {
        recommendations.push(item.textContent.trim());
      });
      
      return { overallScore, scores, feedback, recommendations };
    }
    
    exportIdea(idea, format) {
      const { title, description, twist } = this.getIdeaText(idea);
      const analysis = this.getAnalysisData(idea);
      const date = idea.date || new Date().toLocaleDateString();
      
      switch (format) {
        case 'json':
          this.exportAsJSON({ title, description, twist, analysis, date });
          break;
        case 'csv':
          this.exportAsCSV({ title, description, twist, analysis, date });
          break;
        case 'text':
          this.exportAsText({ title, description, twist, analysis, date });
          break;
        case 'pdf':
          this.exportAsPDF({ title, description, twist, analysis, date });
          break;
      }
    }
    
    exportAsJSON(data) {
      const jsonString = JSON.stringify(data, null, 2);
      this.downloadFile(jsonString, `muse-garden-idea-${Date.now()}.json`, 'application/json');
    }
    
    exportAsCSV(data) {
      let csvContent = 'data:text/csv;charset=utf-8,';
      
      // Headers
      csvContent += 'Title,Description,Twist,Date\n';
      
      // Data
      csvContent += `"${data.title}","${data.description}","${data.twist}","${data.date}"\n\n`;
      
      // Analysis if present
      if (data.analysis) {
        csvContent += 'Analysis\n';
        csvContent += `Overall Score,${data.analysis.overallScore}\n\n`;
        
        csvContent += 'Criterion,Score\n';
        for (const [criterion, score] of Object.entries(data.analysis.scores)) {
          csvContent += `"${criterion}","${score}"\n`;
        }
        
        csvContent += '\nFeedback\n';
        data.analysis.feedback.forEach(item => {
          csvContent += `"${item}"\n`;
        });
        
        csvContent += '\nRecommendations\n';
        data.analysis.recommendations.forEach(item => {
          csvContent += `"${item}"\n`;
        });
      }
      
      this.downloadFile(csvContent, `muse-garden-idea-${Date.now()}.csv`, 'text/csv');
    }
    
    exportAsText(data) {
      let textContent = `${data.title}\n`;
      textContent += `${'-'.repeat(data.title.length)}\n\n`;
      textContent += `Description: ${data.description}\n\n`;
      textContent += `Twist: ${data.twist}\n\n`;
      textContent += `Date: ${data.date}\n\n`;
      
      if (data.analysis) {
        textContent += `ANALYSIS\n${'-'.repeat(8)}\n\n`;
        textContent += `Overall Score: ${data.analysis.overallScore}\n\n`;
        
        textContent += `Breakdown:\n`;
        for (const [criterion, score] of Object.entries(data.analysis.scores)) {
          textContent += `- ${criterion}: ${score}\n`;
        }
        
        textContent += `\nFeedback:\n`;
        data.analysis.feedback.forEach(item => {
          textContent += `- ${item}\n`;
        });
        
        textContent += `\nRecommendations:\n`;
        data.analysis.recommendations.forEach(item => {
          textContent += `- ${item}\n`;
        });
      }
      
      textContent += `\n${'-'.repeat(40)}\n`;
      textContent += `Generated with Muse Garden`;
      
      this.downloadFile(textContent, `muse-garden-idea-${Date.now()}.txt`, 'text/plain');
    }
    
    exportAsPDF(data) {
      // For MVP, we'll create a printer-friendly HTML and open Print dialog
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${data.title} - Muse Garden</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 2rem;
              color: #333;
            }
            h1 {
              color: #4a6fa5;
              border-bottom: 2px solid #4a6fa5;
              padding-bottom: 0.5rem;
            }
            h2 {
              color: #4a6fa5;
              margin-top: 2rem;
            }
            .meta {
              color: #777;
              font-style: italic;
            }
            .section {
              margin: 1.5rem 0;
            }
            .footer {
              margin-top: 3rem;
              text-align: center;
              font-size: 0.9rem;
              color: #777;
              border-top: 1px solid #eee;
              padding-top: 1rem;
            }
          </style>
        </head>
        <body>
          <h1>${data.title}</h1>
          <p class="meta">Generated on ${data.date}</p>
          
          <div class="section">
            <h2>Description</h2>
            <p>${data.description}</p>
          </div>
          
          <div class="section">
            <h2>Creative Twist</h2>
            <p>${data.twist}</p>
          </div>
      `);
      
      if (data.analysis) {
        printWindow.document.write(`
          <div class="section">
            <h2>Analysis</h2>
            <p><strong>Overall Viability Score:</strong> ${data.analysis.overallScore}/10</p>
            
            <h3>Breakdown</h3>
            <ul>
        `);
        
        for (const [criterion, score] of Object.entries(data.analysis.scores)) {
          printWindow.document.write(`<li><strong>${criterion}:</strong> ${score}</li>`);
        }
        
        printWindow.document.write(`
            </ul>
            
            <h3>Key Insights</h3>
            <ul>
        `);
        
        data.analysis.feedback.forEach(item => {
          printWindow.document.write(`<li>${item}</li>`);
        });
        
        printWindow.document.write(`
            </ul>
            
            <h3>Recommendations</h3>
            <ul>
        `);
        
        data.analysis.recommendations.forEach(item => {
          printWindow.document.write(`<li>${item}</li>`);
        });
        
        printWindow.document.write(`
            </ul>
          </div>
        `);
      }
      
      printWindow.document.write(`
          <div class="footer">
            Generated with Muse Garden
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Trigger print dialog
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
    
    downloadFile(content, fileName, mimeType) {
      // Create download link
      const encodedUri = encodeURI(content);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
    }
  }