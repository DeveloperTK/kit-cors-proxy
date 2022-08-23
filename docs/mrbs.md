# Meeting Room Booking Service Dokumentation

Tagesansicht: Beispiel **23.08.2022**

    day.php?day=23&month=8&year=2022&area=42

Buchungsübersicht: Beispiel-Buchung **am 23.08.2022** in **Bereich 42** für Sitzplatz bzw. Raum **Nr. 1167**

    edit_entry.php?area=42&room=1167&period=2&year=2022&month=8&day=23

In der Buchungsansicht müssen zwei Grüne Haken stehen. Ist der erste rot, war jemand anderes schneller. Ist der zweite rot ist die Buchung in der Vergangenheit, zu weit in der Zukunft oder der Nutzer hat schon zu viele Plätze gebucht.

Die Tagesansicht ist ohne Account sichtbar. Wenn der Link zur Buchung geöffnet wird, muss sich der Nutzer erst anmelden, wird dann aber direkt zur Buchung weitergeleitet.
