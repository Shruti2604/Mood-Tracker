const moodLog = JSON.parse(localStorage.getItem('moodLog')) || [];
document.getElementById('saveMood').addEventListener('click', () => {
  const mood = document.getElementById('mood').value.trim();
  const reason = document.getElementById('reason').value.trim();
  const date = new Date().toLocaleDateString();
  if (mood && reason) {
    moodLog.push({ date, mood, reason });
    localStorage.setItem('moodLog', JSON.stringify(moodLog));
    updateMoodLog();
    renderChart();
  }
});

function updateMoodLog() {
  const moodLogContainer = document.getElementById('mood-log');
  moodLogContainer.innerHTML = '';
  const storedLog = JSON.parse(localStorage.getItem('moodLog')) || [];
  storedLog.forEach((entry, index) => {
    const logItem = document.createElement('div');
    logItem.innerHTML = `
      <span>${entry.date}: ${getMoodEmoji(entry.mood)} ${entry.mood} - ${entry.reason}</span>
      <button class="delete-btn" data-index="${index}">🚮</button>
    `;
    moodLogContainer.appendChild(logItem);
  });

  // Add event listener for delete button
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = button.getAttribute('data-index');
      moodLog.splice(index, 1);
      localStorage.setItem('moodLog', JSON.stringify(moodLog));
      updateMoodLog();
      renderChart();
    });
  });
}

function getMoodEmoji(mood) {
  switch (mood) {
    case 'Happy':
      return '😊';
    case 'Sad':
      return '😔';
    case 'Angry':
      return '😠';
    default:
      return '😐';
  }
}

function renderChart() {
  const moodCounts = moodLog.reduce((counts, entry) => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    return counts;
  }, {});

  const ctx = document.getElementById('moodChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(moodCounts),
      datasets: [{
        data: Object.values(moodCounts),
        backgroundColor: Object.keys(moodCounts).map((mood, index) => {
          switch (mood) {
            case 'Happy':
              return 'yellow';
            case 'Sad':
              return 'blue';
            case 'Angry':
              return 'red';
            default:
              return 'green';
          }
        })
      }]
    }
  });
}

updateMoodLog();