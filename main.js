// NexGenFireSafety - Main JavaScript Functionality
// Handles all interactive components, animations, and user interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeScrollAnimations();
    initializeCounters();
    initializeCharts();
    initializeDemo();
    initializeROI();
    initializeForms();
    initializeNavigation();
    initializeMobileMenu();
    initializeUseCasesTabs();
    initializeVideoThumbnail();
    initializeTypedText();
    
    console.log('NexGenFireSafety website initialized successfully');
});

// Try to programmatically play the hero video and log any errors.
function 
attemptPlayHeroVideo() {
    try {
        const vid = document.querySelector('.hero-video');
        if (!vid) {
            console.warn('Hero video element not found');
            return;
        }

        // Log current attributes and source for debugging
        console.log('Hero video element found:', {
            src: vid.currentSrc || vid.src,
            muted: vid.muted,
            autoplay: vid.autoplay,
            loop: vid.loop,
            playsinline: vid.playsInline || vid.getAttribute('playsinline')
        });

        // Attempt to play and report any errors
        const playPromise = vid.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Hero video playback started successfully');
            }).catch((err) => {
                console.error('Hero video play() rejected:', err);
                // Show play button overlay so user can start playback manually
                const btn = document.getElementById('heroPlayButton');
                if (btn) btn.style.display = 'flex';
                // If playback failed, try setting muted and retry once more
                try {
                    vid.muted = true;
                    vid.setAttribute('muted', '');
                    vid.play().then(() => {
                        console.log('Hero video playback started after setting muted');
                        // hide play button if visible
                        const btn2 = document.getElementById('heroPlayButton');
                        if (btn2) btn2.style.display = 'none';
                    }).catch((err2) => {
                        console.error('Retry play() also failed:', err2);
                        const btn3 = document.getElementById('heroPlayButton');
                        if (btn3) btn3.style.display = 'flex';
                    });
                } catch (innerErr) {
                    console.error('Error while retrying play():', innerErr);
                }
            });
        }
    } catch (e) {
        console.error('attemptPlayHeroVideo error:', e);
    }
}

// Attempt to play after load to give the browser time to fetch the resource
window.addEventListener('load', function() {
    setTimeout(attemptPlayHeroVideo, 250);
});

// Attach diagnostics: events and computed styles to help debug playback
function attachHeroVideoDiagnostics() {
    try {
        const vid = document.querySelector('.hero-video');
        if (!vid) return;

        // Log element + sources
        console.log('Attaching hero video diagnostics');
        console.log('video.src / currentSrc:', vid.src, vid.currentSrc);
        const sources = vid.querySelectorAll('source');
        sources.forEach((s, i) => console.log('source[' + i + ']:', s.src, s.type));

        // Log properties
        console.log('video properties:', {
            muted: vid.muted,
            autoplay: vid.autoplay,
            loop: vid.loop,
            paused: vid.paused,
            readyState: vid.readyState,
            networkState: vid.networkState,
            duration: isFinite(vid.duration) ? vid.duration : null,
            videoWidth: vid.videoWidth,
            videoHeight: vid.videoHeight
        });

        // Computed style
        const cs = window.getComputedStyle(vid);
        console.log('computedStyle for hero-video:', {
            display: cs.display,
            visibility: cs.visibility,
            opacity: cs.opacity,
            zIndex: cs.zIndex,
            position: cs.position
        });

        // Event listeners for lifecycle
        const events = ['loadedmetadata','loadeddata','canplay','canplaythrough','playing','play','pause','error','stalled','waiting','suspend','abort'];
        events.forEach(ev => {
            vid.addEventListener(ev, (e) => {
                console.log('hero-video event:', ev, e);
                if (ev === 'error') {
                    console.error('Video error object:', vid.error);
                }
            });
        });

        // Wire play button if present
        const btn = document.getElementById('heroPlayButton');
        if (btn) {
            btn.style.display = vid.paused ? 'flex' : 'none';
            btn.addEventListener('click', function() {
                vid.muted = true;
                vid.setAttribute('muted', '');
                vid.play().then(() => {
                    console.log('Hero video started via user Play button');
                    btn.style.display = 'none';
                }).catch(err => {
                    console.error('User-initiated play() failed:', err);
                });
            });
        }
    } catch (e) {
        console.error('attachHeroVideoDiagnostics error:', e);
    }
}

document.addEventListener('DOMContentLoaded', attachHeroVideoDiagnostics);

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Animated Counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stats-counter, .counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Chart Initialization
function initializeCharts() {
    // Market Growth Chart (Homepage)
    const marketChartElement = document.getElementById('marketChart');
    if (marketChartElement) {
        const marketChart = echarts.init(marketChartElement);
        
        const marketOption = {
            title: {
                text: 'Fire Protection Market Growth',
                textStyle: {
                    color: '#2C3E50',
                    fontSize: 18,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['Total Market', 'Data Center Segment']
            },
            xAxis: {
                type: 'category',
                data: ['2024', '2025', '2026', '2027', '2028', '2029', '2030']
            },
            yAxis: {
                type: 'value',
                name: 'Market Size (Billions USD)'
            },
            series: [
                {
                    name: 'Total Market',
                    type: 'line',
                    data: [68.9, 71.97, 76.7, 81.9, 87.5, 93.6, 118.14],
                    smooth: true,
                    lineStyle: {
                        color: '#B7472A',
                        width: 3
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(183, 71, 42, 0.3)'
                            }, {
                                offset: 1, color: 'rgba(183, 71, 42, 0.1)'
                            }]
                        }
                    }
                },
                {
                    name: 'Data Center Segment',
                    type: 'line',
                    data: [1.4, 1.53, 1.67, 1.83, 2.0, 2.19, 3.4],
                    smooth: true,
                    lineStyle: {
                        color: '#8FBC8F',
                        width: 3
                    }
                }
            ]
        };
        
        marketChart.setOption(marketOption);
        
        // Responsive resize
        window.addEventListener('resize', () => {
            marketChart.resize();
        });
    }

    // Market Growth Chart (Investors page)
    const marketGrowthElement = document.getElementById('marketGrowthChart');
    if (marketGrowthElement) {
        const growthChart = echarts.init(marketGrowthElement);
        
        const growthOption = {
            title: {
                text: 'Market Growth Projection',
                textStyle: {
                    color: '#2C3E50',
                    fontSize: 18,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                    let result = params[0].name + '<br/>';
                    params.forEach(param => {
                        result += param.seriesName + ': $' + param.value + 'B<br/>';
                    });
                    return result;
                }
            },
            xAxis: {
                type: 'category',
                data: ['2024', '2025', '2026', '2027', '2028', '2029', '2030']
            },
            yAxis: {
                type: 'value',
                name: 'Market Size (Billions USD)'
            },
            series: [
                {
                    name: 'Total Market',
                    type: 'bar',
                    data: [68.9, 71.97, 76.7, 81.9, 87.5, 93.6, 118.14],
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#B7472A'
                            }, {
                                offset: 1, color: '#E67E22'
                            }]
                        }
                    }
                }
            ]
        };
        
        growthChart.setOption(growthOption);
        
        window.addEventListener('resize', () => {
            growthChart.resize();
        });
    }
}

// Interactive Demo
let currentScenario = 'datacenter';
let demoRunning = false;

function initializeDemo() {
    // Demo is initialized when user clicks "Start Demo"
    const canvas = document.createElement('canvas');
    canvas.id = 'demoCanvas';
    canvas.className = 'absolute inset-0 w-full h-full';
    
    const visualization = document.getElementById('demoVisualization');
    if (visualization) {
        // Check if canvas already exists
        const existingCanvas = document.getElementById('demoCanvas');
        if (!existingCanvas) {
            visualization.appendChild(canvas);
            canvas.width = visualization.offsetWidth;
            canvas.height = visualization.offsetHeight;
        }
    }
}

function selectScenario(scenario, event) {
    currentScenario = scenario;
    
    // Update button states
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback: find button by scenario
        const buttons = document.querySelectorAll('.scenario-btn');
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(scenario.replace('center', ' center'))) {
                btn.classList.add('active');
            }
        });
    }
    
    // Reset and update demo visualization
    resetDemo();
    updateDemoVisualization();
}

function startDemo() {
    if (demoRunning) return;
    
    demoRunning = true;
    const visualization = document.getElementById('demoVisualization');
    const canvas = document.getElementById('demoCanvas');
    
    if (!canvas) {
        initializeDemo();
        setTimeout(startDemo, 100);
        return;
    }
    
    canvas.width = visualization.offsetWidth;
    canvas.height = visualization.offsetHeight;
    
    // Hide the instruction text
    const instructionDiv = visualization.querySelector('.absolute.inset-0.flex');
    if (instructionDiv) {
        instructionDiv.style.display = 'none';
    }
    
    // Reset progress bars
    resetDemoProgress();
    
    // Start animated demo
    runDemoAnimation(canvas);
    
    // Start detection phase
    setTimeout(() => {
        animateProgress('detectionProgress', 100, 1200);
        document.getElementById('detectionTime').textContent = '1.2s';
        
        // Start analysis phase
        setTimeout(() => {
            animateProgress('analysisProgress', 100, 800);
            document.getElementById('confidenceLevel').textContent = '99.7%';
            
            // Start suppression phase
            setTimeout(() => {
                animateProgress('suppressionProgress', 100, 1000);
                document.getElementById('damageLevel').textContent = 'Minimal';
                
                // Demo complete
                setTimeout(() => {
                    demoRunning = false;
                    showDemoComplete();
                }, 500);
            }, 800);
        }, 1200);
    }, 500);
}

function runDemoAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let frame = 0;
    let fireX = width * 0.7;
    let fireY = height * 0.6;
    let fireSize = 0;
    let maxFireSize = 40;
    let suppressing = false;
    let suppressionParticles = [];
    
    // Scenario-specific layouts
    const layouts = {
        datacenter: [
            { x: 0.2, y: 0.3, w: 0.15, h: 0.4, label: 'Server Rack' },
            { x: 0.4, y: 0.3, w: 0.15, h: 0.4, label: 'Server Rack' },
            { x: 0.65, y: 0.3, w: 0.15, h: 0.4, label: 'Server Rack' },
        ],
        telecom: [
            { x: 0.15, y: 0.25, w: 0.25, h: 0.5, label: 'Switch' },
            { x: 0.5, y: 0.25, w: 0.35, h: 0.5, label: 'Router Bank' },
        ],
        industrial: [
            { x: 0.1, y: 0.4, w: 0.2, h: 0.35, label: 'Machine' },
            { x: 0.4, y: 0.35, w: 0.25, h: 0.4, label: 'Control Panel' },
            { x: 0.75, y: 0.4, w: 0.15, h: 0.35, label: 'Equipment' },
        ]
    };
    
    const layout = layouts[currentScenario] || layouts.datacenter;
    
    function animate() {
        if (!demoRunning) return;
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw scenario layout
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 40) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        
        // Draw equipment
        layout.forEach(item => {
            ctx.fillStyle = '#475569';
            ctx.fillRect(item.x * width, item.y * height, item.w * width, item.h * height);
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            ctx.strokeRect(item.x * width, item.y * height, item.w * width, item.h * height);
            
            // Label
            ctx.fillStyle = '#94a3b8';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, (item.x + item.w / 2) * width, (item.y + item.h / 2) * height);
        });
        
        // Grow fire
        if (frame < 60 && fireSize < maxFireSize) {
            fireSize += 0.8;
        }
        
        // Start suppression at frame 60
        if (frame >= 60 && !suppressing) {
            suppressing = true;
        }
        
        // Draw fire
        if (fireSize > 0 && !suppressing) {
            // Flames
            for (let i = 0; i < 5; i++) {
                const flameX = fireX + (Math.random() - 0.5) * fireSize * 0.5;
                const flameY = fireY - Math.random() * fireSize;
                const flameSize = fireSize * (0.3 + Math.random() * 0.4);
                
                const gradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, flameSize);
                gradient.addColorStop(0, '#ffaa00');
                gradient.addColorStop(0.5, '#ff6600');
                gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(flameX, flameY, flameSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Heat glow
            const glowGradient = ctx.createRadialGradient(fireX, fireY, 0, fireX, fireY, fireSize * 2);
            glowGradient.addColorStop(0, 'rgba(255, 100, 0, 0.3)');
            glowGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(fireX, fireY, fireSize * 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Suppression system
        if (suppressing) {
            // Create suppression particles
            if (frame % 3 === 0 && fireSize > 1) {
                for (let i = 0; i < 3; i++) {
                    suppressionParticles.push({
                        x: width * 0.5 + (Math.random() - 0.5) * 100,
                        y: 50,
                        vx: (Math.random() - 0.5) * 2,
                        vy: Math.random() * 3 + 2,
                        life: 1
                    });
                }
            }
            
            // Shrink fire
            fireSize *= 0.95;
            if (fireSize < 1) fireSize = 0;
            
            // Draw suppression nozzle
            ctx.fillStyle = '#60a5fa';
            ctx.fillRect(width * 0.48, 30, width * 0.04, 20);
            ctx.beginPath();
            ctx.moveTo(width * 0.48, 50);
            ctx.lineTo(width * 0.45, 60);
            ctx.lineTo(width * 0.55, 60);
            ctx.lineTo(width * 0.52, 50);
            ctx.closePath();
            ctx.fill();
        }
        
        // Update and draw suppression particles
        suppressionParticles = suppressionParticles.filter(p => p.life > 0);
        suppressionParticles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.life -= 0.02;
            
            ctx.fillStyle = `rgba(147, 197, 253, ${particle.life})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw AI detection overlay
        if (frame >= 20 && frame < 60) {
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(fireX - fireSize - 10, fireY - fireSize - 10, (fireSize + 10) * 2, (fireSize + 10) * 2);
            ctx.setLineDash([]);
            
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 14px Inter';
            ctx.textAlign = 'left';
            ctx.fillText('FIRE DETECTED', fireX + fireSize + 15, fireY - 20);
            ctx.font = '12px Inter';
            ctx.fillText('Confidence: 99.7%', fireX + fireSize + 15, fireY);
        }
        
        frame++;
        
        if (frame < 150 || suppressing) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function animateProgress(elementId, targetWidth, duration) {
    const element = document.getElementById(elementId);
    const startWidth = 0;
    const increment = (targetWidth - startWidth) / (duration / 16);
    let currentWidth = startWidth;
    
    const animate = () => {
        if (currentWidth < targetWidth) {
            currentWidth += increment;
            element.style.width = Math.min(currentWidth, targetWidth) + '%';
            requestAnimationFrame(animate);
        } else {
            element.style.width = targetWidth + '%';
        }
    };
    
    animate();
}

function resetDemoProgress() {
    document.getElementById('detectionProgress').style.width = '0%';
    document.getElementById('analysisProgress').style.width = '0%';
    document.getElementById('suppressionProgress').style.width = '0%';
    
    document.getElementById('detectionTime').textContent = '--';
    document.getElementById('confidenceLevel').textContent = '--';
    document.getElementById('damageLevel').textContent = '--';
}

function showDemoComplete() {
    const visualization = document.getElementById('demoVisualization');
    const canvas = document.getElementById('demoCanvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Draw success overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw success icon and message
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Success circle
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(centerX, centerY - 40, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Check mark
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY - 40);
        ctx.lineTo(centerX - 5, centerY - 30);
        ctx.lineTo(centerX + 15, centerY - 50);
        ctx.stroke();
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Demo Complete!', centerX, centerY + 20);
        
        ctx.font = '16px Inter';
        ctx.fillStyle = '#d1d5db';
        ctx.fillText('Fire detected and suppressed in 3.2 seconds with minimal damage', centerX, centerY + 50);
    }
    
    // Show reset button overlay
    const existingOverlay = visualization.querySelector('.demo-complete-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'demo-complete-overlay absolute inset-0 flex items-end justify-center pb-8 pointer-events-none';
    overlay.innerHTML = `
        <button onclick="resetDemo()" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors pointer-events-auto shadow-lg">
            Run Demo Again
        </button>
    `;
    visualization.appendChild(overlay);
}

function resetDemo() {
    const visualization = document.getElementById('demoVisualization');
    const canvas = document.getElementById('demoCanvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Show instruction text again
    const existingInstruction = visualization.querySelector('.absolute.inset-0.flex');
    if (existingInstruction) {
        existingInstruction.style.display = 'flex';
    } else {
        const instructionDiv = document.createElement('div');
        instructionDiv.className = 'absolute inset-0 flex items-center justify-center text-white';
        instructionDiv.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1"></path>
                    </svg>
                </div>
                <h4 class="text-xl font-bold mb-2">Click "Start Demo" to Begin</h4>
                <p class="text-gray-300">Interactive visualization will show real-time fire detection and suppression process</p>
            </div>
        `;
        visualization.appendChild(instructionDiv);
    }
    
    resetDemoProgress();
}

function updateDemoVisualization() {
    // Update visualization based on selected scenario
    const scenarios = {
        datacenter: {
            title: 'Data Center Environment',
            description: 'High-density server racks with precision cooling systems'
        },
        telecom: {
            title: 'Telecom Facility',
            description: 'Communication switching equipment with backup power systems'
        },
        industrial: {
            title: 'Industrial Plant',
            description: 'Manufacturing equipment with various fire risk factors'
        }
    };
    
    const scenario = scenarios[currentScenario];
    
    // Update instruction text to reflect scenario
    const visualization = document.getElementById('demoVisualization');
    const instructionText = visualization.querySelector('.text-gray-300');
    if (instructionText && scenario) {
        instructionText.textContent = `${scenario.description} - Click "Start Demo" to see AI detection in action`;
    }
}

// ROI Calculator
function initializeROI() {
    // ROI calculator is initialized when user clicks "Calculate ROI"
}

function calculateROI() {
    const facilitySize = parseInt(document.getElementById('facilitySize').value) || 10000;
    const equipmentValue = parseInt(document.getElementById('equipmentValue').value) || 2000000;
    const downtimeCost = parseInt(document.getElementById('downtimeCost').value) || 350000;
    const currentCost = parseInt(document.getElementById('currentCost').value) || 75000;
    
    // Calculate system cost (estimated)
    const systemCost = Math.max(50000, facilitySize * 3); // $3 per sq ft minimum $50K
    const annualSavings = currentCost * 0.4 + (downtimeCost * 0.1); // 40% reduction in protection costs + 10% of downtime risk
    const paybackMonths = Math.ceil(systemCost / (annualSavings / 12));
    const fiveYearROI = Math.round(((annualSavings * 5 - systemCost) / systemCost) * 100);
    const totalSavings = annualSavings * 5 - systemCost;
    
    // Update display
    document.getElementById('initialInvestment').textContent = '$' + systemCost.toLocaleString();
    document.getElementById('annualSavings').textContent = '$' + Math.round(annualSavings).toLocaleString();
    document.getElementById('paybackPeriod').textContent = paybackMonths;
    document.getElementById('fiveYearROI').textContent = fiveYearROI + '%';
    document.getElementById('totalSavings').textContent = '$' + Math.round(totalSavings).toLocaleString();
    
    // Update chart
    updateROIChart(systemCost, annualSavings);
}

function updateROIChart(initialCost, annualSavings) {
    const roiChartElement = document.getElementById('roiChart');
    if (!roiChartElement) return;
    
    const roiChart = echarts.init(roiChartElement);
    
    const years = ['Year 0', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    const currentSystem = [0, -75000, -150000, -225000, -300000, -375000];
    const nexgenSystem = [-initialCost, -initialCost + annualSavings, -initialCost + annualSavings * 2, 
                         -initialCost + annualSavings * 3, -initialCost + annualSavings * 4, 
                         -initialCost + annualSavings * 5];
    
    const roiOption = {
        title: {
            text: 'Cost Comparison',
            textStyle: {
                color: '#2C3E50',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(param => {
                    result += param.seriesName + ': $' + Math.abs(param.value).toLocaleString() + '<br/>';
                });
                return result;
            }
        },
        legend: {
            data: ['Current System', 'NexGenFireSafety']
        },
        xAxis: {
            type: 'category',
            data: years
        },
        yAxis: {
            type: 'value',
            name: 'Cumulative Cost ($)'
        },
        series: [
            {
                name: 'Current System',
                type: 'line',
                data: currentSystem,
                lineStyle: {
                    color: '#ef4444',
                    width: 3
                }
            },
            {
                name: 'NexGenFireSafety',
                type: 'line',
                data: nexgenSystem,
                lineStyle: {
                    color: '#10b981',
                    width: 3
                }
            }
        ]
    };
    
    roiChart.setOption(roiOption);
}

// Form Handling
function initializeForms() {
    // Demo request form
    const demoForm = document.querySelector('#demoModal form');
    if (demoForm) {
        demoForm.addEventListener('submit', handleDemoSubmission);
    }
    
    // Contact form - only handle forms without action attribute (not using FormSubmit)
    const contactForms = document.querySelectorAll('section#contact form:not([action])');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactSubmission);
    });
}

function openDemoForm() {
    document.getElementById('demoModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeDemoForm() {
    document.getElementById('demoModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function openPitchDeckForm() {
    document.getElementById('pitchDeckModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closePitchDeckForm() {
    document.getElementById('pitchDeckModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function downloadPitchDeck(event) {
    event.preventDefault();
    
    // Simulate download process
    const button = event.target;
    const originalText = button.textContent;
    
    button.textContent = 'Preparing Download...';
    button.disabled = true;
    
    setTimeout(() => {
        // Show success message
        alert('Thank you! The pitch deck has been sent to your email address.');
        closePitchDeckForm();
        
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

function handleDemoSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Simulate form submission
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your demo request! We will contact you within 24 hours to schedule your personalized demonstration.');
        closeDemoForm();
        event.target.reset();
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

function handleContactSubmission(event) {
    event.preventDefault();
    
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! We will get back to you within 24 hours.');
        event.target.reset();
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
}

// Navigation
function initializeNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active navigation state
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('text-yellow-300');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('text-yellow-300');
        }
    });
}

// Use Cases Tabs
function initializeUseCasesTabs() {
    const tabs = document.querySelectorAll('.usecase-tab');
    const panels = document.querySelectorAll('.usecase-panel');
    if (!tabs.length || !panels.length) return;

    const activate = (targetId) => {
        panels.forEach(p => {
            if (p.id === targetId) {
                p.classList.remove('hidden');
            } else {
                p.classList.add('hidden');
            }
        });
        tabs.forEach(t => {
            const isActive = t.getAttribute('data-target') === targetId;
            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            if (isActive) {
                t.classList.add('btn-primary','text-white');
                t.classList.remove('glass-effect');
            } else {
                t.classList.remove('btn-primary');
                t.classList.add('glass-effect');
            }
        });
    };

    // Click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            activate(target);
            // Update hash for deep linking
            if (history.pushState) {
                const url = new URL(window.location);
                url.hash = target;
                history.pushState(null, '', url);
            } else {
                window.location.hash = target;
            }
        });
    });

    // Deep link support via hash
    const initialHash = (window.location.hash || '').replace('#','');
    const defaultPanel = initialHash && document.getElementById(initialHash) ? initialHash : panels[0].id;
    activate(defaultPanel);
}

// Mobile Menu
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuToggle || !mobileMenu) return;
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = menuToggle.contains(event.target) || mobileMenu.contains(event.target);
        if (!isClickInsideNav && mobileMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
}

// Utility Functions
function scrollToROI() {
    const roiSection = document.getElementById('roi-calculator');
    if (roiSection) {
        roiSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Error Handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
});

// Performance Monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.now();
    console.log('Page loaded in ' + Math.round(loadTime) + 'ms');
});

// Video thumbnail click handler - shows YouTube iframe on click
function initializeVideoThumbnail() {
    const thumbnail = document.getElementById('heroVideoThumbnail');
    if (!thumbnail) return;

    thumbnail.addEventListener('click', function() {
        // Hide thumbnail and play button
        const thumbnailImg = document.getElementById('videoThumbnailImg');
        const playButton = document.getElementById('videoPlayButton');
        const iframe = document.getElementById('heroVideoFrame');

        if (thumbnailImg) thumbnailImg.style.display = 'none';
        if (playButton) playButton.style.display = 'none';
        if (iframe) {
            iframe.style.display = 'block';
            // Reload iframe with autoplay to start video
            const src = iframe.src;
            iframe.src = src;
        }
    });

    // Add hover effect to play button
    thumbnail.addEventListener('mouseenter', function() {
        const playButton = document.getElementById('videoPlayButton');
        if (playButton) playButton.style.transform = 'translate(-50%, -50%) scale(1.1)';
    });

    thumbnail.addEventListener('mouseleave', function() {
        const playButton = document.getElementById('videoPlayButton');
        if (playButton) playButton.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

// Typed text effect for hero section
function initializeTypedText() {
    const typedTextElement = document.getElementById('typed-text');
    if (!typedTextElement) return;

    const messages = [
        'Revolutionary AI technology that sees fire before it spreads.',
        'Millisecond detection with 99.7% accuracy.',
        'Automated suppression with precision targeting.'
    ];

    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;
    let deletingSpeed = 30;
    let pauseEnd = 2000;

    function type() {
        const currentMessage = messages[messageIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentMessage.length) {
            // Pause at end of message
            isDeleting = true;
            setTimeout(type, pauseEnd);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
        }

        const speed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(type, speed);
    }

    // Start typing effect
    type();
}

// Export functions for global access
window.NexGenFireSafety = {
    selectScenario,
    startDemo,
    calculateROI,
    openDemoForm,
    closeDemoForm,
    openPitchDeckForm,
    closePitchDeckForm,
    downloadPitchDeck,
    scrollToROI,
    initializeMobileMenu
};