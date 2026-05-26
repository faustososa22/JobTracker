export const getStatusLabel = (status: number): string => {
    const labels: Record<number, string> = {
      0: 'Applied',
      1: 'Interviewing',
      2: 'Offered',
      3: 'Rejected'
    }
    return labels[status] ?? 'Unknown'
  }

  export const getStatusBadgeColor = (status: number): string => {
    const colors: Record<number, string> = {
      0: 'bg-primary',    // Applied - azul
      1: 'bg-warning',    // Interviewing - amarillo
      2: 'bg-success',    // Offered - verde
      3: 'bg-danger'      // Rejected - rojo
    }
    return colors[status] ?? 'bg-secondary'
  }