import Button from "@/app/components/ui/Button";
import Field from "@/app/components/ui/Field";
import Card from "@/app/components/ui/Card";

export default function NewJob() {
  return (
    <main dir="rtl" className="max-w-screen-md mx-auto px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold mb-4">משרה חדשה</h1>

      <Card className="p-4 space-y-4">
        <Field label="כותרת" placeholder="למשל: מלצרות לאירוע" />
        <Field label="מיקום" placeholder="רחוב, עיר" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="שעת התחלה" type="datetime-local" />
          <Field label="שעת סיום" type="datetime-local" />
        </div>
        <Field label="שכר לשעה (₪)" type="number" placeholder="55" />
        <div className="pt-2">
          <Button type="submit">שמור ופרסם</Button>
        </div>
      </Card>
    </main>
  );
}
