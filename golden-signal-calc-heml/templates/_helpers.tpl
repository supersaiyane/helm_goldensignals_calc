{{/* 
  Returns the chart name (e.g., "golden-signal-calc")
*/}}
{{- define "golden-signal-calc.name" -}}
{{ .Chart.Name }}
{{- end }}

{{/* 
  Returns the full release name, e.g., calc-prod-golden-signal-calc 
*/}}
{{- define "golden-signal-calc.fullname" -}}
{{ .Release.Name }}-{{ include "golden-signal-calc.name" . }}
{{- end }}

{{/* 
  Returns the service account name used by the pod
*/}}
{{- define "golden-signal-calc.serviceAccountName" -}}
{{ include "golden-signal-calc.fullname" . }}-sa
{{- end }}

{{/* 
  Environment name extraction (dev, stage, prod) from release name
  Assuming you use release name like calc-dev, calc-stage etc.
*/}}
{{- define "golden-signal-calc.env" -}}
{{- if contains "dev" .Release.Name -}} dev
{{- else if contains "stage" .Release.Name -}} stage
{{- else if contains "prod" .Release.Name -}} prod
{{- else -}} unknown
{{- end -}}
{{- end }}

{{/* 
  Common labels — used in metadata.labels
*/}}
{{- define "golden-signal-calc.labels" -}}
app.kubernetes.io/name: {{ include "golden-signal-calc.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
environment: {{ include "golden-signal-calc.env" . }}
{{- end }}
