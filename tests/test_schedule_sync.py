import unittest

from scripts.sync_drive_schedule import TableReader, events_from_rows


class ScheduleSyncTests(unittest.TestCase):
    def test_google_docs_html_table(self):
        html = """
        <html><body><table><tbody>
        <tr><td><p>Date</p></td><td>Event</td><td>Room</td><td>Debrief</td></tr>
        <tr><td>10/28/26</td><td><span>Halloween Distress/pumpkin carving?</span></td><td>STEM102</td><td>Funding?</td></tr>
        <tr><td>11/4/26</td><td>Guess the AI Image</td><td>STEM 102</td><td></td></tr>
        <tr><td>11/25/26</td><td>Cancelled(thanksgiving break)</td><td></td><td></td></tr>
        <tr><td>12/2/26</td><td></td><td></td><td></td></tr>
        </tbody></table></body></html>
        """
        reader = TableReader()
        reader.feed(html)
        events = events_from_rows(reader.rows)
        self.assertEqual(len(events), 2)
        self.assertEqual(events[0]["date"], "2026-10-28")
        self.assertEqual(events[0]["status"], "Tentative")
        self.assertEqual(events[0]["location"], "STEM 102 (planned)")
        self.assertEqual(events[0]["title"], "Halloween De-stress/pumpkin carving")
        self.assertEqual(events[1]["title"], "Guess the AI Image")
        self.assertNotIn("funding", str(events).lower())

    def test_ignores_bad_dates_and_canceled_events(self):
        rows = [
            ["Date", "Event", "Room"],
            ["42/17/26", "Not a real date", ""],
            ["11/12/26", "Canceled due to break", ""],
            ["11/18/26", "Typing Competition", ""],
        ]
        events = events_from_rows(rows)
        self.assertEqual(len(events), 1)
        self.assertEqual(events[0]["date"], "2026-11-18")
        self.assertEqual(events[0]["location"], "Location TBA")


if __name__ == "__main__":
    unittest.main()
