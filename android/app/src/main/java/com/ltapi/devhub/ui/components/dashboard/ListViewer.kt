package com.ltapi.devhub.ui.components.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.SubcomposeAsyncImage
import com.ltapi.devhub.database.Issue
import com.ltapi.devhub.services.Utils
import com.ltapi.devhub.ui.components.custom.Header
import kotlinx.coroutines.runBlocking
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material.icons.filled.TextFormat
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.AlignmentLine
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ltapi.devhub.ui.theme.AppTypography
import com.ltapi.devhub.database.Commit
import com.ltapi.devhub.database.PullRequest
import com.ltapi.devhub.ui.components.basic.AppDropdownMenu
import com.ltapi.devhub.ui.components.basic.DropdownMenuItemProperty
import com.ltapi.devhub.ui.components.custom.shimmer.AppLoadingBar
import com.ltapi.devhub.ui.components.custom.shimmer.LoadingShimmerEffect
import com.ltapi.devhub.utils.DatetimeUtils
import com.safety.notifier.ui.components.SearchBar
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.lang.Exception
import java.util.*


suspend fun fetchIssue(requestBody: JSONObject): List<Issue>? {
    try {
        return Utils().sendPostRequest<List<Issue>>(
            "http://10.0.2.2:8080/issue",
            requestBody.toString()
        )
    } catch (
        e: Exception
    ) {
        println(e)
    }

    return null
}

suspend fun fetchCommits(requestBody: JSONObject): List<Commit>? {
    try {
        return Utils().sendPostRequest<List<Commit>>(
            "http://10.0.2.2:8080/commit",
            requestBody.toString()
        )
    } catch (
        e: Exception
    ) {
        println(e)
    }

    return null
}

suspend fun fetchPullRequests(requestBody: JSONObject): List<PullRequest>? {
    try {
        return Utils().sendPostRequest<List<PullRequest>>(
            "http://10.0.2.2:8080/pullRequest",
            requestBody.toString()
        )
    } catch (
        e: Exception
    ) {
        println(e)
    }

    return null
}


@Composable
fun <T> ListViewer(resourceName: String, fetch: suspend (JSONObject) -> List<T>?) {

    val list = remember { mutableStateListOf<T>() }
    var fetchState by remember { mutableStateOf("fetching") }
    var requestBodyType by remember { mutableStateOf("basic") }
    var searchStr by remember { mutableStateOf("") }
    var sortType by remember { mutableStateOf("") }


    // Fetching
    suspend fun runFetchingProcess(requestBody: JSONObject) {
        val newList = fetch(requestBody)

        if (newList != null) {
            // remove old items
            val removeList: MutableList<T> = mutableListOf()

            for (e in list) {
                if (!newList.contains(e)) {
                    removeList.add(e)
                }
            }

            list.removeAll(removeList)

            // add new items
            for (e in newList) {
                if (!list.contains(e)) {
                    list.add(e)
                }
            }

            fetchState = "fetched"
        } else {
            fetchState = "fetching fail"
        }
    }

    fun basicRequestBody(): JSONObject {
        val requestBody = JSONObject()
        val queryJson = JSONObject()

        queryJson.put("repo", "repo0")

        requestBody.put("query", queryJson)
        requestBody.put("sort", getSortQuery(sortType))

        return requestBody
    }

    fun searchRequestBody(): JSONObject {
        val requestBody = JSONObject()
        val queryJson = JSONObject()
        val fieldJson = JSONObject()

        queryJson.put("repo", "repo0")
        fieldJson.put("title", "text")

        requestBody.put("query", queryJson)
        requestBody.put("field", fieldJson)
        requestBody.put("searchStr", searchStr)
        requestBody.put("sort", getSortQuery(sortType))

        return requestBody
    }

    LaunchedEffect(key1 = fetchState, block = {
        if (fetchState == "fetching") {
            when (requestBodyType) {
                "basic" -> runFetchingProcess(basicRequestBody())
                "search" -> runFetchingProcess(searchRequestBody())
            }
        }
    })

    fun refresh() {
        requestBodyType = "basic"
        fetchState = "fetching"
    }

    fun search() {
        requestBodyType = "search"
        fetchState = "fetching"
    }

    fun onSearch(str: String) {
        searchStr = str
        search()
    }


    // Sort
    fun handleSortTypeChanged(str: String) {
        sortType = str

        refresh()
    }

    val sortTypeMenuItems = listOf(
        DropdownMenuItemProperty("By date", Icons.Filled.DateRange, ::handleSortTypeChanged),
        DropdownMenuItemProperty("By name", Icons.Filled.TextFormat, ::handleSortTypeChanged)
    )


    // Render
    Column(
        verticalArrangement = Arrangement.spacedBy(4.dp)
    ) {

        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
//            Header(
//                text = resourceName
//            )

            SearchBar(label = resourceName.lowercase(), onDoneActionClick = ::onSearch)

            Spacer(modifier = Modifier.weight(1f))

            AppDropdownMenu(sortTypeMenuItems)

//            Row(
//                horizontalArrangement = Arrangement.spacedBy(8.dp),
//                verticalAlignment = Alignment.CenterVertically
//            ) {
//                Icon(imageVector = Icons.Filled.Sort, contentDescription = null)
//
//                Text("By date")
//            }
        }

        Divider(color = MaterialTheme.colorScheme.surfaceVariant)

        // List
        if (fetchState == "fetched") {
            LazyColumn(Modifier.weight(1f)) {
                items(list) { item ->
//                    when (resourceName) {
//                        "Issue" -> IssueItem(item as Issue)
//                        "Commit" -> CommitItem(item as Commit)
//                    }

                    val e: Any

                    when (resourceName) {
                        "Issue" -> {
                            e = item as Issue
                            Item(e.title, e.number, e.owner.name, e.owner.avatar_url, e.created_at)
                        }
                        "Commit" -> {
                            e = item as Commit
                            Item(
                                e.title,
                                e.number,
                                e.commiter.name,
                                e.commiter.avatar_url,
                                e.created_at
                            )
                        }
                        "Pull Request" -> {
                            e = item as PullRequest
                            Item(e.title, e.state, e.user.name, e.user.avatar_url, e.created_at)
                        }
                    }
                }
            }
        } else if (fetchState == "fetching") {
            Spacer(modifier = Modifier.weight(1f))
            AppLoadingBar("Fetching $resourceName...")
        } else {
            Spacer(modifier = Modifier.weight(1f))
            ErrorText("Fetching failed. Please check your internet...")
        }

        // Refresh Button
        Button(
            onClick = { refresh() },
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
        ) {
            Text("Refresh")
        }
    }
}


@Composable
fun IssueItem(issue: Issue) {

    Surface() {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {

                // Avatar
                SubcomposeAsyncImage(
                    model = issue.owner.avatar_url,
                    loading = {
                        CircularProgressIndicator()
                    },
                    contentDescription = null,
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .align(Alignment.Top),
                    contentScale = ContentScale.Crop
                )

                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {

                    Row(
                        modifier = Modifier.heightIn(0.dp, 36.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {


//                        Badge(
//                            modifier = Modifier.weight(1f),
//                            containerColor = getIssueLabelColor(issue.label)
//                        ) {
//                            Text(
//                                issue.label,
//                                modifier = Modifier.padding(4.dp),
//                                color = Color.White
//                            )
//                        }

//                        Spacer(modifier = Modifier.weight(1f))

                        Text(
                            issue.owner.name,
                            modifier = Modifier.weight(1f)
                        )

                        Text(
                            DatetimeUtils().toDatetime(issue.created_at),
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            style = AppTypography.bodySmall
                        )
                    }

                    Text(
                        "#${issue.number}",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        style = AppTypography.bodySmall
                    )
                }
            }

            Text(
                text = issue.title,
                modifier = Modifier.fillMaxWidth(),
                fontWeight = FontWeight.Bold,
                overflow = TextOverflow.Ellipsis,
                softWrap = false,
            )

            OutlinedButton(
                onClick = { /*TODO*/ },
//                colors = ButtonDefaults.buttonColors(MaterialTheme.colorScheme.secondary),
//                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 0.dp)
            ) {
                Text("Mark as read")
            }
        }
    }

    Divider(color = MaterialTheme.colorScheme.surfaceVariant)
}


@Composable
fun Item(title: String, number: String, userName: String, avatar_url: String, created_at: Date) {

    Surface() {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {

                // Avatar
                SubcomposeAsyncImage(
                    model = avatar_url,
                    loading = {
                        CircularProgressIndicator()
                    },
                    contentDescription = null,
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .align(Alignment.Top),
                    contentScale = ContentScale.Crop
                )

                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {

                    Row(
                        modifier = Modifier.heightIn(0.dp, 36.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = userName,
                            modifier = Modifier.weight(1f)
                        )

                        Text(
                            DatetimeUtils().toDatetime(created_at),
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            style = AppTypography.bodySmall
                        )
                    }

                    Text(
                        "#${number}",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        style = AppTypography.bodySmall
                    )
                }
            }

            Text(
                text = title,
                modifier = Modifier.fillMaxWidth(),
                fontWeight = FontWeight.Bold,
                overflow = TextOverflow.Ellipsis,
                softWrap = false,
            )

            OutlinedButton(
                onClick = { /*TODO*/ },
            ) {
                Text("Mark as read")
            }
        }
    }

    Divider(color = MaterialTheme.colorScheme.surfaceVariant)
}


@Composable
fun ErrorText(err: String) {
    Text(
        text = err,
        modifier = Modifier.padding(horizontal = 16.dp),
        color = MaterialTheme.colorScheme.error
    )
}


@Composable
fun getIssueLabelColor(label: String): Color {
    when (label) {
        "Status: Unconfirmed" -> return Color.Gray
        "Status: Confirmed" -> return Color.Green.copy(0.5f)
        "Question" -> return Color.Cyan.copy(0.5f)
        "Bug" -> return MaterialTheme.colorScheme.error
        else -> return Color.Black
    }
}


fun getSortQuery(sortType: String): JSONObject {
    val json = JSONObject()

    when (sortType) {
        "By date" -> return json.put("created_at", -1)
        "By label" -> return json.put("label", -1)
        "By name" -> return json.put("title", -1)
        else -> return json.put("created_at", -1)
    }
}