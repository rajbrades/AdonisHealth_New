import { ClinicalNoteTemplateEditor } from "@/components/provider/clinical-note-template-editor"

export default function ClinicalNotePage({ params }: { params: { id: string } }) {
  return <ClinicalNoteTemplateEditor consultationId={params.id} patientId="1" />
}
