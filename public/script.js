// Enhanced JavaScript functionality with real API calls
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const urlForm = document.getElementById('url-form');
    const responseOutput = document.getElementById('response-output');
    const loadingBar = document.getElementById('loading-bar');
    const responseTime = document.getElementById('response-time');
    const responseSize = document.getElementById('response-size');
    
    // Add loading animation
    function showLoading() {
        if (loadingBar) {
            loadingBar.classList.remove('hidden');
        }
        responseOutput.innerHTML = '<code class="language-json">Loading...</code>';
    }
    
    function hideLoading() {
        if (loadingBar) {
            loadingBar.classList.add('hidden');
        }
    }
    
    // Format JSON response
    function formatJson(data) {
        try {
            return JSON.stringify(data, null, 2);
        } catch (e) {
            return data;
        }
    }
    
    // Update stats
    function updateStats(startTime, data) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const size = new Blob([typeof data === 'string' ? data : JSON.stringify(data)]).size;
        
        if (responseTime) {
            responseTime.textContent = `${duration}ms`;
        }
        if (responseSize) {
            responseSize.textContent = `${size} bytes`;
        }
    }
    
    // Helper to display results
    const displayResult = (data, format = 'json') => {
        const responseCode = responseOutput.querySelector('code');
        if (responseCode) {
            responseCode.className = `language-${format}`;
            if (format === 'json') {
                responseCode.textContent = formatJson(data);
            } else {
                responseCode.textContent = data;
            }
        } else {
            if (format === 'json') {
                responseOutput.innerHTML = `<code class="language-json">${formatJson(data)}</code>`;
            } else {
                responseOutput.innerHTML = `<code class="language-${format}">${data}</code>`;
            }
        }
    };
    
    // Helper to show loading/error states
    const showMessage = (message) => {
        const responseCode = responseOutput.querySelector('code');
        if (responseCode) {
            responseCode.className = '';
            responseCode.textContent = message;
        } else {
            responseOutput.innerHTML = `<code>${message}</code>`;
        }
    };
    
    // Search form handler
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const startTime = Date.now();
        showLoading();
        
        const query = document.getElementById('search-query').value;
        const limit = document.getElementById('search-limit').value;
        
        const url = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            hideLoading();
            displayResult(data);
            updateStats(startTime, data);
        } catch (error) {
            hideLoading();
            showMessage(`Error: ${error.message}`);
            updateStats(startTime, error.message);
        }
    });
    
    // URL form handler
    urlForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const action = e.submitter.dataset.action;
        if (!action) return;
        
        const startTime = Date.now();
        showLoading();
        
        const urlValue = document.getElementById('url-input').value;
        showMessage(`Fetching from /${action}...`);
        
        const apiUrl = `/${action}?url=${encodeURIComponent(urlValue)}`;
        const isJson = action === 'article' || action === 'citation';
        
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            
            let data;
            if (isJson) {
                data = await response.json();
                displayResult(data, 'json');
            } else {
                data = await response.text();
                displayResult(data, action === 'html' ? 'html' : 'markdown');
            }
            
            hideLoading();
            updateStats(startTime, data);
        } catch (error) {
            hideLoading();
            showMessage(`Error: ${error.message}`);
            updateStats(startTime, error.message);
        }
    });
    
    // Add particle animation
    function createParticle() {
        const particlesContainer = document.querySelector('.particles');
        if (!particlesContainer) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 6000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 1000);
    
    // Add hover effects to interactive elements
    document.querySelectorAll('.interactive').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});